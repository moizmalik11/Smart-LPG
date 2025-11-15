import { useEffect, useMemo, useState } from 'react'

function loadStore(id){
  const key = `lpg_store_${id}`
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : { inventory: { '45kg': { filled:10, empty:0 } }, transactions: [], khatabook: {} }
}

function saveStore(id, data){
  const key = `lpg_store_${id}`
  localStorage.setItem(key, JSON.stringify(data))
}

function todayDateKey(){
  const d = new Date()
  return d.toISOString().slice(0,10)
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

// Custom hook for store management
export function useStore(sessionId){
  const [store, setStore] = useState(()=>loadStore(sessionId))
  const todaysKey = todayDateKey()

  useEffect(()=>{saveStore(sessionId, store)},[store, sessionId])
  useEffect(()=>{setStore(loadStore(sessionId))},[sessionId])

  const todaysTransactions = useMemo(()=> store.transactions.filter(t=>t.date===todaysKey),[store,todaysKey])
  const todaysSalesValue = useMemo(()=>{
    return todaysTransactions.reduce((sum,t)=> sum + (t.type==='sale' ? t.amount : 0), 0)
  },[todaysTransactions])

  const weekDates = useMemo(()=>getWeekDates(),[]) 
  const weeklySales = useMemo(()=>{
    return store.transactions
      .filter(t => t.type==='sale' && weekDates.includes(t.date))
      .reduce((sum,t)=> sum + t.amount, 0)
  },[store, weekDates])

  const totalFilled = Object.values(store.inventory).reduce((s,i)=>s + (i.filled||0),0)
  const totalEmpty = Object.values(store.inventory).reduce((s,i)=>s + (i.empty||0),0)

  const addShipment = (type='45kg', count=1, note='') => {
    setStore(s=>{
      const next = JSON.parse(JSON.stringify(s))
      if(!next.inventory[type]) next.inventory[type] = {filled:0,empty:0}
      next.inventory[type].filled += Number(count)
      next.transactions.unshift({ date: todaysKey, type:'shipment', qty: Number(count), note: note || 'shipment received' })
      return next
    })
  }

  const recordSale = (type='45kg', qty=1, perKgRate=0, note='') => {
    const q = Number(qty || 0)
    if(!q || q <= 0) return { success: false, message: 'Invalid quantity' }

    const current = store.inventory && store.inventory[type] ? store.inventory[type] : { filled: 0, empty: 0 }
    if(current.filled < q){
      return { success: false, message: 'Cylinder 0 hai — out of stock' }
    }

    const weight = type === '45kg' ? 45 : 0
    const amount = Number(q) * weight * Number(perKgRate || 0)
    setStore(s=>{
      const next = JSON.parse(JSON.stringify(s))
      if(!next.inventory[type]) next.inventory[type] = {filled:0,empty:0}
      next.inventory[type].filled = Math.max(0, next.inventory[type].filled - q)
      next.inventory[type].empty += q
      next.transactions.unshift({ date: todaysKey, type:'sale', qty: q, amount, ratePerKg: Number(perKgRate||0), note: note || 'sale' })
      return next
    })
    return { success: true, message: 'Sale recorded', amount }
  }

  const manageEmpty = (type, qty) => {
    const q = Number(qty || 0)
    if(!q || q <= 0) return { success: false, message: 'Invalid quantity' }
    
    const current = store.inventory[type]
    if(!current || q > current.empty){
      return { success: false, message: 'Not enough empty cylinders' }
    }
    
    setStore(s=>{
      const next = JSON.parse(JSON.stringify(s))
      if(!next.inventory[type]) next.inventory[type] = {filled:0,empty:0}
      next.inventory[type].empty -= q
      next.inventory[type].filled += q
      next.transactions.unshift({ date: todaysKey, type:'refill', qty: q, note: 'empty -> filled' })
      return next
    })
    return { success: true, message: 'Refilled successfully' }
  }

  const addKhataEntry = (name, kg) => {
    const q = Number(kg || 0)
    if(!name || !name.toString().trim()) return { success: false, message: 'Name required' }
    if(!q || q <= 0) return { success: false, message: 'Invalid kg' }

    setStore(s=>{
      const next = JSON.parse(JSON.stringify(s))
      if(!next.khatabook) next.khatabook = {}
      const key = name.toString().trim()
      next.khatabook[key] = (next.khatabook[key] || 0) + q
      if(!next.transactions) next.transactions = []
      next.transactions.unshift({ date: todaysKey, type:'khata', name: key, kg: q, note: 'credit' })
      return next
    })
    return { success: true, message: 'Recorded in Khata' }
  }

  return { store, todaysTransactions, todaysSalesValue, weeklySales, totalFilled, totalEmpty, addShipment, recordSale, manageEmpty, addKhataEntry }
}
