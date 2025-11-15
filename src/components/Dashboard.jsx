import React, { useEffect, useMemo, useState } from 'react'

function loadStore(id){
  const key = `lpg_store_${id}`
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : { inventory: { '45kg': { filled:10, empty:0 } }, transactions: [] }
}

function saveStore(id, data){
  const key = `lpg_store_${id}`
  localStorage.setItem(key, JSON.stringify(data))
}

function todayDateKey(){
  const d = new Date()
  return d.toISOString().slice(0,10)
}

const NAV = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'sales', label: 'Sales', icon: '💰' },
  { id: 'shipments', label: 'Shipments', icon: '🚚' },
  { id: 'reports', label: 'Reports', icon: '📄' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]

export default function Dashboard({ session, renameShop }){
  const [store, setStore] = useState(()=>loadStore(session.id))
  const [perKgRate, setPerKgRate] = useState(0)
  const [txNote, setTxNote] = useState('')
  const [view, setView] = useState('overview')
  const [showEdit, setShowEdit] = useState(false)
  const [newShopName, setNewShopName] = useState(session.name)
  const [perKgEditing, setPerKgEditing] = useState(false)
  const [perKgDraft, setPerKgDraft] = useState(perKgRate)
  const [saleQty, setSaleQty] = useState(1)
  const [shipQty, setShipQty] = useState(5)

  const currencyFmt = new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formatPKR = v => `PKR ${currencyFmt.format(Number(v) || 0)}`

  useEffect(()=>{
    saveStore(session.id, store)
  },[store, session.id])

  useEffect(()=>{
    setStore(loadStore(session.id))
    setNewShopName(session.name)
  },[session.id, session.name])

  const todaysKey = todayDateKey()

  const todaysTransactions = useMemo(()=> store.transactions.filter(t=>t.date===todaysKey),[store,todaysKey])

  const todaysSalesValue = useMemo(()=>{
    return todaysTransactions.reduce((sum,t)=> sum + (t.type==='sale' ? t.amount : 0), 0)
  },[todaysTransactions])

  function addShipment(type='45kg', count=1){
    setStore(s=>{
      const next = JSON.parse(JSON.stringify(s))
      if(!next.inventory[type]) next.inventory[type] = {filled:0,empty:0}
      next.inventory[type].filled += Number(count)
      next.transactions.unshift({ date: todaysKey, type:'shipment', qty: Number(count), note: txNote || 'shipment received' })
      return next
    })
    setTxNote('')
  }

  function manageEmpty(type){
    const qStr = window.prompt('Enter how many empty cylinders to refill (move to filled):', '0')
    const q = Number(qStr || 0)
    if(!q || q <= 0) return
    setStore(s=>{
      const next = JSON.parse(JSON.stringify(s))
      if(!next.inventory[type]) next.inventory[type] = {filled:0,empty:0}
      if(q > next.inventory[type].empty){
        alert('Not enough empty cylinders')
        return s
      }
      next.inventory[type].empty -= q
      next.inventory[type].filled += q
      next.transactions.unshift({ date: todaysKey, type:'refill', qty: q, note: 'empty -> filled' })
      return next
    })
  }

  function recordSale(type='45kg', qty=1){
    const weight = type === '45kg' ? 45 : 0
    const amount = Number(qty) * weight * Number(perKgRate || 0)
    setStore(s=>{
      const next = JSON.parse(JSON.stringify(s))
      if(!next.inventory[type]) next.inventory[type] = {filled:0,empty:0}
      next.inventory[type].filled = Math.max(0, next.inventory[type].filled - Number(qty))
      next.inventory[type].empty += Number(qty)
      next.transactions.unshift({ date: todaysKey, type:'sale', qty: Number(qty), amount, ratePerKg: Number(perKgRate||0), note: txNote || 'sale' })
      return next
    })
    setTxNote('')
  }

  // KPIs
  const totalFilled = Object.values(store.inventory).reduce((s,i)=>s + (i.filled||0),0)
  const totalEmpty = Object.values(store.inventory).reduce((s,i)=>s + (i.empty||0),0)



  return (
    <div className="flex gap-6">
      <aside className="bg-white rounded-lg p-4 shadow flex flex-col w-64">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-semibold text-lg">{session.name}</div>
            <div className="text-sm text-slate-500">Mashallah</div>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {NAV.map(n => (
            <div key={n.id} onClick={()=>setView(n.id)} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-slate-50 ${view===n.id ? 'bg-slate-100' : ''}`}>
              <div className="w-8 text-center">{n.icon}</div>
              <div>{n.label}</div>
            </div>
          ))}
        </nav>

        <div className="mt-auto text-xs text-slate-400">Dummy data only — backend later</div>
      </aside>

      <main className="flex-1 flex flex-col gap-4">
        <header className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
          
          <div className="flex items-center gap-3">
              <div className="text-xl font-semibold">{session.name}</div>
              <div className="text-sm text-slate-500">Shop ID: <code className="text-xs">{session.id}</code></div>
              <button className="ml-2 px-3 py-1 border rounded text-sm" onClick={()=>setShowEdit(true)}>Edit</button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">Per-kg</div>
              <input className="w-28 p-2 border rounded" type="number" value={perKgDraft} onChange={e=>setPerKgDraft(e.target.value)} disabled={!perKgEditing} />
              {!perKgEditing ? (
                <button className="px-3 py-1 border rounded text-sm" onClick={()=>{ setPerKgDraft(perKgRate); setPerKgEditing(true); }}>Edit</button>
              ) : (
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded text-sm" onClick={()=>{ setPerKgEditing(false); setPerKgDraft(perKgRate); }}>Cancel</button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm" onClick={()=>{ setPerKgRate(Number(perKgDraft||0)); setPerKgEditing(false); }}>Save</button>
                </div>
              )}
            </div>
        </header>

        {showEdit && (
          <div className="modal-overlay" onClick={()=>setShowEdit(false)}>
            <div className="modal bg-white p-5 rounded" onClick={e=>e.stopPropagation()}>
              <h3 className="text-lg font-semibold">Edit Shop Name</h3>
              <p className="text-sm text-slate-500">Changing the name will create/point to a shop id slug.</p>
              <div className="mt-3">
                <input className="w-full p-2 border rounded" value={newShopName} onChange={e=>setNewShopName(e.target.value)} />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button className="px-3 py-1 border rounded" onClick={()=>setShowEdit(false)}>Cancel</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={()=>{ renameShop(newShopName); setShowEdit(false); }}>Save</button>
              </div>
            </div>
          </div>
        )}

        <section>
          {view === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm text-slate-500">Filled Cylinders</div>
                <div className="text-2xl font-bold">{totalFilled}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm text-slate-500">Empty Cylinders</div>
                <div className="text-2xl font-bold">{totalEmpty}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-sm text-slate-500">Today's Sales</div>
                <div className="text-2xl font-bold">{formatPKR(todaysSalesValue)}</div>
              </div>
            </div>
            )}

            {view === 'inventory' && (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Inventory</h3>
                <div className="mt-3 space-y-3">
                  {Object.entries(store.inventory).map(([type,st])=> (
                    <div key={type} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-semibold">{type}</div>
                        <div className="text-sm text-slate-600">Filled: {st.filled} • Empty: {st.empty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border rounded" onClick={()=>addShipment(type,1)}>Receive +1</button>
                        <button className="px-3 py-1 border rounded" onClick={()=>recordSale(type,1)}>Sell -1</button>
                        <button className="px-3 py-1 border rounded" onClick={()=>manageEmpty(type)}>Manage Empty</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'sales' && (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Sales</h3>
                <div className="mt-3 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-sm text-slate-600">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Qty</th>
                        <th className="py-2 pr-4">Amount</th>
                        <th className="py-2 pr-4">Rate (/kg)</th>
                        <th className="py-2">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.transactions.filter(t=>t.type==='sale').map((s,i)=>(
                        <tr key={i} className="border-t">
                          <td className="py-2 pr-4 text-sm text-slate-700">{s.date}</td>
                          <td className="py-2 pr-4 text-sm">{s.qty}</td>
                          <td className="py-2 pr-4 text-sm">{formatPKR(s.amount)}</td>
                          <td className="py-2 pr-4 text-sm">{formatPKR(s.ratePerKg)}</td>
                          <td className="py-2 text-sm text-slate-600">{s.note}</td>
                        </tr>
                      ))}
                      {store.transactions.filter(t=>t.type==='sale').length === 0 && (
                        <tr><td className="py-2 text-sm text-slate-500" colSpan={5}>No sales yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-4 bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Recent Transactions</h3>
              <div className="mt-2 space-y-2">
                {store.transactions.length === 0 && <div className="text-sm text-slate-500">No transactions yet</div>}
                {store.transactions.slice(0,10).map((t,i)=> (
                  <div key={i} className="p-2 rounded border">
                    <div className="flex justify-between">
                      <div className="font-medium">{t.type}</div>
                      <div className="text-sm text-slate-500">{t.date}</div>
                    </div>
                    <div className="text-sm text-slate-600">Qty: {t.qty} • {t.note}</div>
                    {t.type === 'sale' && <div className="text-sm text-slate-700 mt-1">{formatPKR(t.amount)} • @ {formatPKR(t.ratePerKg)}/kg</div>}
                  </div>
                ))}
              </div>
            </div>
        </section>
      </main>
    </div>
  )
}
