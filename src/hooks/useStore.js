import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function todayDateKey(){
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getWeekDates(){
  const today = new Date()
  const week = []
  for(let i=6; i>=0; i--){
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    week.push(d.toISOString().slice(0,10))
  }
  return week
}

export function useStore(sessionId){
  const [store, setStore] = useState({ inventory: { '45kg': { filled: 0, empty: 0 } }, transactions: [], khatabook: {}, perKgRate: 0 })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const todaysKey = todayDateKey()

  useEffect(() => {
    if (!sessionId) return
    fetchStoreData()
  }, [sessionId])

  const fetchStoreData = async () => {
    setLoading(true)
    try {
      // 1. Fetch shop per_kg_rate profile
      const { data: shopData } = await supabase
        .from('shops')
        .select('per_kg_rate')
        .eq('id', sessionId)
        .single()

      // 2. Fetch inventory stock counts
      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('*')
        .eq('shop_id', sessionId)

      // 3. Fetch khata entries
      const { data: khataData } = await supabase
        .from('khatabook')
        .select('*')
        .eq('shop_id', sessionId)

      // 4. Fetch transactions ledger
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('shop_id', sessionId)
        .order('created_at', { ascending: false })

      // Structure inventory key mapping
      const inventoryMap = {}
      if (inventoryData) {
        inventoryData.forEach(item => {
          inventoryMap[item.cylinder_type] = {
            filled: item.filled,
            empty: item.empty
          }
        })
      }
      if (!inventoryMap['45kg']) {
        inventoryMap['45kg'] = { filled: 0, empty: 0 }
      }

      // Structure khatabook key mapping
      const khataMap = {}
      if (khataData) {
        khataData.forEach(item => {
          khataMap[item.customer_name] = {
            kg: Number(item.kg),
            amount: Number(item.amount)
          }
        })
      }

      // Sync local hook state tree
      setStore({
        inventory: inventoryMap,
        transactions: txData || [],
        khatabook: khataMap,
        perKgRate: shopData?.per_kg_rate || 0
      })
    } catch (err) {
      console.error('Error fetching Supabase store coordinates:', err)
    } finally {
      setLoading(false)
    }
  }

  const todaysTransactions = useMemo(()=> store.transactions.filter(t=>t.date===todaysKey),[store,todaysKey])
  const todaysSalesValue = useMemo(()=>{
    return todaysTransactions.reduce((sum,t)=> sum + (t.type==='sale' ? Number(t.amount || 0) : 0), 0)
  },[todaysTransactions])

  const weekDates = useMemo(()=>getWeekDates(),[todaysKey]) 
  const weeklySales = useMemo(()=>{
    return store.transactions
      .filter(t => t.type==='sale' && weekDates.includes(t.date))
      .reduce((sum,t)=> sum + Number(t.amount || 0), 0)
  },[store, weekDates])

  const totalFilled = Object.values(store.inventory).reduce((s,i)=>s + (i.filled||0),0)
  const totalEmpty = Object.values(store.inventory).reduce((s,i)=>s + (i.empty||0),0)

  const updatePerKgRate = async (rate) => {
    setActionLoading(true)
    try {
      const r = Number(rate || 0)
      const { error } = await supabase
        .from('shops')
        .update({ per_kg_rate: r })
        .eq('id', sessionId)

      if (!error) {
        setStore(prev => ({ ...prev, perKgRate: r }))
        return { success: true, message: 'Price rate updated' }
      }
      return { success: false, message: error.message }
    } finally {
      setActionLoading(false)
    }
  }

  const updateInventory = async (type, filled, empty) => {
    setActionLoading(true)
    try {
      const f = Number(filled || 0)
      const e = Number(empty || 0)
      if(f < 0 || e < 0) return { success: false, message: 'Invalid counts' }

      const { error } = await supabase
        .from('inventory')
        .upsert({
          shop_id: sessionId,
          cylinder_type: type,
          filled: f,
          empty: e
        }, { onConflict: 'shop_id,cylinder_type' })

      if (!error) {
        await supabase.from('transactions').insert({
          shop_id: sessionId,
          date: todaysKey,
          type: 'inventory_update',
          note: `Manual audit for ${type}`
        })
        await fetchStoreData()
        return { success: true, message: 'Inventory updated' }
      }
      return { success: false, message: error.message }
    } finally {
      setActionLoading(false)
    }
  }

  const recordSale = async (type='45kg', qty=1, perKgRate=0, note='') => {
    setActionLoading(true)
    try {
      const q = Number(qty || 0)
      if(!q || q <= 0) return { success: false, message: 'Invalid quantity' }

      const current = store.inventory[type] || { filled: 0, empty: 0 }
      if(current.filled < q){
        return { success: false, message: 'Cylinder 0 hai — out of stock' }
      }

      const match = type.match(/([\d.]+)\s*kg/i)
      const weight = match ? parseFloat(match[1]) : 0
      const activeRate = Number(perKgRate) || Number(store.perKgRate || 0)
      const amount = q * weight * activeRate

      // 1. Update Inventory counts in Supabase
      const { error: stockError } = await supabase
        .from('inventory')
        .update({
          filled: current.filled - q,
          empty: current.empty + q
        })
        .eq('shop_id', sessionId)
        .eq('cylinder_type', type)

      if (stockError) return { success: false, message: stockError.message }

      // 2. Insert transaction row
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          shop_id: sessionId,
          date: todaysKey,
          type: 'sale',
          qty: q,
          amount,
          rate_per_kg: activeRate,
          note: note || 'Sale logged'
        })

      if (txError) return { success: false, message: txError.message }

      await fetchStoreData()
      return { success: true, message: 'Sale recorded successfully', amount }
    } finally {
      setActionLoading(false)
    }
  }

  const manageEmpty = async (type, qty) => {
    setActionLoading(true)
    try {
      const q = Number(qty || 0)
      if(!q || q <= 0) return { success: false, message: 'Invalid quantity' }
      
      const current = store.inventory[type] || { filled: 0, empty: 0 }
      if(q > current.empty){
        return { success: false, message: 'Not enough empty cylinders' }
      }
      
      const { error: stockError } = await supabase
        .from('inventory')
        .update({
          empty: current.empty - q,
          filled: current.filled + q
        })
        .eq('shop_id', sessionId)
        .eq('cylinder_type', type)

      if (stockError) return { success: false, message: stockError.message }

      await supabase.from('transactions').insert({
        shop_id: sessionId,
        date: todaysKey,
        type: 'refill',
        qty: q,
        note: 'Empty refilled'
      })

      await fetchStoreData()
      return { success: true, message: 'Refilled successfully' }
    } finally {
      setActionLoading(false)
    }
  }

  const addKhataEntry = async (name, kg, perKgRate) => {
    setActionLoading(true)
    try {
      const q = Number(kg || 0)
      const rate = Number(perKgRate || 0)
      if(!name || !name.toString().trim()) return { success: false, message: 'Name required' }
      if(!q || q <= 0) return { success: false, message: 'Invalid kg' }
      if(!rate || rate <= 0) return { success: false, message: 'Per-kg rate not set' }

      const amount = q * rate
      const key = name.toString().trim()

      // Fetch active customer entry if exists
      const { data: currentRecord } = await supabase
        .from('khatabook')
        .select('*')
        .eq('shop_id', sessionId)
        .eq('customer_name', key)
        .maybeSingle()

      const newKg = (currentRecord?.kg || 0) + q
      const newAmount = (currentRecord?.amount || 0) + amount

      const { error: khataError } = await supabase
        .from('khatabook')
        .upsert({
          shop_id: sessionId,
          customer_name: key,
          kg: newKg,
          amount: newAmount
        }, { onConflict: 'shop_id,customer_name' })

      if (khataError) return { success: false, message: khataError.message }

      await supabase.from('transactions').insert({
        shop_id: sessionId,
        date: todaysKey,
        type: 'khata',
        name: key,
        qty: q,
        amount,
        rate_per_kg: rate,
        note: 'Credit entry'
      })

      await fetchStoreData()
      return { success: true, message: 'Recorded in Khata' }
    } finally {
      setActionLoading(false)
    }
  }

  const settleKhata = async (name, paidAmount) => {
    setActionLoading(true)
    try {
      const paid = Number(paidAmount || 0)
      if(!name || !name.toString().trim()) return { success: false, message: 'Name required' }
      if(!paid || paid <= 0) return { success: false, message: 'Invalid amount' }

      const key = name.toString().trim()

      // Fetch customer profile
      const { data: currentRecord } = await supabase
        .from('khatabook')
        .select('*')
        .eq('shop_id', sessionId)
        .eq('customer_name', key)
        .maybeSingle()

      if (!currentRecord) return { success: false, message: 'Record not found' }

      const currentAmount = Number(currentRecord.amount || 0)
      if (paid > currentAmount) {
        return { success: false, message: 'ye amount remaining se zyada hai' }
      }

      const currentKg = Number(currentRecord.kg || 0)
      const newAmount = Math.max(0, currentAmount - paid)
      
      // Calculate proportional kg
      const ratePerKg = currentKg > 0 && currentAmount > 0 ? currentAmount / currentKg : 0
      const paidKg = ratePerKg > 0 ? paid / ratePerKg : 0
      const newKg = Math.max(0, currentKg - paidKg)

      if (newAmount === 0 && newKg === 0) {
        await supabase
          .from('khatabook')
          .delete()
          .eq('shop_id', sessionId)
          .eq('customer_name', key)
      } else {
        await supabase
          .from('khatabook')
          .update({
            kg: newKg,
            amount: newAmount
          })
          .eq('shop_id', sessionId)
          .eq('customer_name', key)
      }

      await supabase.from('transactions').insert({
        shop_id: sessionId,
        date: todaysKey,
        type: 'settlement',
        name: key,
        amount: paid,
        qty: paidKg,
        note: 'Payment logged'
      })

      await fetchStoreData()
      return { success: true, message: 'Payment recorded' }
    } finally {
      setActionLoading(false)
    }
  }

  const deleteSale = async (transactionId, note, qty) => {
    setActionLoading(true)
    try {
      if (!transactionId) return { success: false, message: 'Transaction ID required' }
      
      // Parse cylinder type from transaction note (e.g. "Direct sale of 1x 45kg" -> "45kg")
      let cylinderType = '45kg'
      if (note) {
        const match = note.match(/(\d+\s*kg)/i)
        if (match) {
          cylinderType = match[1].toLowerCase().replace(/\s+/g, '')
        }
      }

      const current = store.inventory[cylinderType] || { filled: 0, empty: 0 }

      const { error: stockError } = await supabase
        .from('inventory')
        .update({
          filled: current.filled + Number(qty || 0),
          empty: Math.max(0, current.empty - Number(qty || 0))
        })
        .eq('shop_id', sessionId)
        .eq('cylinder_type', cylinderType)

      if (stockError) return { success: false, message: stockError.message }

      const { error: txError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('shop_id', sessionId)

      if (txError) return { success: false, message: txError.message }

      await fetchStoreData()
      return { success: true, message: 'Sale deleted successfully!' }
    } finally {
      setActionLoading(false)
    }
  }

  return { store, loading, todaysTransactions, todaysSalesValue, weeklySales, totalFilled, totalEmpty, recordSale, manageEmpty, addKhataEntry, settleKhata, updateInventory, updatePerKgRate, deleteSale, actionLoading }
}

