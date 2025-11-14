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

export default function Dashboard({ session }){
  const [store, setStore] = useState(()=>loadStore(session.id))
  const [perKgRate, setPerKgRate] = useState(0)
  const [txNote, setTxNote] = useState('')
  const [view, setView] = useState('overview')

  useEffect(()=>{
    saveStore(session.id, store)
  },[store, session.id])

  useEffect(()=>{
    setStore(loadStore(session.id))
  },[session.id])

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
    <div className="layout">
      <aside className="sidebar card">
        <div className="brand">
          <div className="brand-title">{session.name}</div>
          <div className="brand-sub">Masha Allah</div>
        </div>

        <nav>
          {NAV.map(n => (
            <div key={n.id} className={`nav-item ${view===n.id ? 'active' : ''}`} onClick={()=>setView(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
        </nav>

        <div style={{flex:1}} />

        <div className="sidebar-foot small">Dummy data only — backend later</div>
      </aside>

      <div className="main">
        <header className="topbar card spaced">
          <div className="top-left">
            <strong>{session.name}</strong>
            <div className="small">Shop ID: <code>{session.id}</code></div>
          </div>
          <div className="top-right">
            <div className="small">Per-kg: PKR <input className="inline-input" type="number" value={perKgRate} onChange={e=>setPerKgRate(e.target.value)} /></div>
          </div>
        </header>

        <div className="content">
          {view === 'overview' && (
            <div>
              <div className="cards">
                <div className="card kpi">
                  <div className="kpi-label">Filled Cylinders</div>
                  <div className="kpi-value">{totalFilled}</div>
                </div>
                <div className="card kpi">
                  <div className="kpi-label">Empty Cylinders</div>
                  <div className="kpi-value">{totalEmpty}</div>
                </div>
                <div className="card kpi">
                  <div className="kpi-label">Today's Sales (PKR)</div>
                  <div className="kpi-value">{todaysSalesValue.toFixed(2)}</div>
                </div>
              </div>

              <div className="card">
                <h3>Recent Transactions</h3>
                <div className="tx-list">
                  {store.transactions.length === 0 && <div className="small">No transactions yet</div>}
                  {store.transactions.slice(0,10).map((t,i)=> (
                    <div key={i} className="tx-row">
                      <div><strong>{t.type}</strong> • {t.qty} pcs • {t.date}</div>
                      {t.type==='sale' && <div className="small">PKR {Number(t.amount).toFixed(2)} • @ PKR {Number(t.ratePerKg).toFixed(2)}/kg</div>}
                      <div className="small">{t.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'inventory' && (
            <div>
              <div className="card">
                <h3>Inventory</h3>
                {Object.entries(store.inventory).map(([type,st])=> (
                  <div key={type} className="row spaced" style={{marginBottom:12}}>
                    <div>
                      <div style={{fontWeight:600}}>{type}</div>
                      <div className="small">Filled: {st.filled} • Empty: {st.empty}</div>
                    </div>
                    <div className="row">
                      <button onClick={()=>addShipment(type,1)}>Receive +1</button>
                      <div style={{width:8}} />
                      <button onClick={()=>recordSale(type,1)}>Sell -1</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'sales' && (
            <div>
              <div className="card">
                <h3>Today's Sales</h3>
                <div className="small">Date: {todaysKey}</div>
                <div style={{height:8}} />
                <div className="small">Transactions today: {todaysTransactions.length}</div>
                <div className="small">Sales value today: PKR {todaysSalesValue.toFixed(2)}</div>
              </div>

              <div className="card">
                <h3>Record a Sale</h3>
                <div className="row" style={{gap:8,alignItems:'center'}}>
                  <label className="small">Type</label>
                  <select onChange={()=>{}} defaultValue={'45kg'}>
                    <option value="45kg">45kg</option>
                  </select>
                  <label className="small">Qty</label>
                  <input type="number" defaultValue={1} id="sale-qty" style={{width:80}} />
                  <button onClick={()=>{ const q = Number(document.getElementById('sale-qty').value || 1); recordSale('45kg', q) }}>Sell</button>
                </div>
              </div>
            </div>
          )}

          {view === 'shipments' && (
            <div>
              <div className="card">
                <h3>Receive Shipment</h3>
                <div className="row" style={{gap:8,alignItems:'center'}}>
                  <label className="small">Type</label>
                  <select defaultValue={'45kg'}>
                    <option value="45kg">45kg</option>
                  </select>
                  <label className="small">Qty</label>
                  <input type="number" defaultValue={5} id="ship-qty" style={{width:80}} />
                  <button onClick={()=>{ const q = Number(document.getElementById('ship-qty').value || 1); addShipment('45kg', q) }}>Receive</button>
                </div>
              </div>
            </div>
          )}

          {view === 'reports' && (
            <div>
              <div className="card">
                <h3>Reports</h3>
                <div className="small">CSV export and detailed reports will be added later.</div>
              </div>
            </div>
          )}

          {view === 'settings' && (
            <div>
              <div className="card">
                <h3>Settings</h3>
                <div className="small">Shop ID: <code>{session.id}</code></div>
                <div className="small">Shop Name: {session.name}</div>
                <div style={{height:8}} />
                <div className="small">Note: change shop name from top-left in App if needed.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
