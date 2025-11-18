import React, { useEffect, useState } from 'react'
import { useStore } from '../hooks/useStore'

const NAV = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'sales', label: 'Sales', icon: '💰' },
  { id: 'shipments', label: 'Khata Book', icon: '📒' },
  { id: 'reports', label: 'Reports', icon: '📄' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]

export default function Dashboard({ session, renameShop }){
  const { store, todaysTransactions, todaysSalesValue, weeklySales, totalFilled, totalEmpty, addShipment, recordSale, manageEmpty, addKhataEntry, settleKhata, updateInventory } = useStore(session.id)
  
  const [perKgRate, setPerKgRate] = useState(0)
  const [view, setView] = useState('overview')
  const [showEdit, setShowEdit] = useState(false)
  const [newShopName, setNewShopName] = useState(session.name)
  const [perKgEditing, setPerKgEditing] = useState(false)
  const [perKgDraft, setPerKgDraft] = useState(perKgRate)
  const [managingEmpty, setManagingEmpty] = useState(null)
  const [emptyQty, setEmptyQty] = useState('')
  const [toast, setToast] = useState(null)
  const [khataName, setKhataName] = useState('')
  const [khataKg, setKhataKg] = useState('')
  const [addingTo, setAddingTo] = useState(null)
  const [addKgValue, setAddKgValue] = useState('')
  const [settlingName, setSettlingName] = useState(null)
  const [settleAmount, setSettleAmount] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [inventoryEdits, setInventoryEdits] = useState({})

  const currencyFmt = new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formatPKR = v => `PKR ${currencyFmt.format(Number(v) || 0)}`

  useEffect(()=>{
    setNewShopName(session.name)
  },[session.name])

  useEffect(()=>{
    if(!toast) return
    const t = setTimeout(()=>setToast(null), 3000)
    return ()=>clearTimeout(t)
  },[toast])

  return (
    <div className="flex gap-6 min-h-screen">
      <aside className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5 shadow-xl border border-slate-100 flex flex-col w-72 h-screen sticky top-0">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {session.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-lg text-slate-800">{session.name}</div>
            <div className="text-sm text-blue-600 font-medium">Mashallah LPG</div>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV.map(n => (
            <div 
              key={n.id} 
              onClick={()=>setView(n.id)} 
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                view===n.id 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="w-8 text-center text-xl">{n.icon}</div>
              <div className="font-medium">{n.label}</div>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-4 text-xs text-slate-400 text-center border-t border-slate-200">Dummy data • Backend later</div>
      </aside>

      <main className="flex-1 flex flex-col gap-5">
        <header className="bg-gradient-to-r from-white to-slate-50 p-4 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-slate-800">{session.name}</div>
                <div className="text-sm text-slate-500 mt-1">Shop ID: <code className="text-xs bg-slate-100 px-2 py-1 rounded">{session.id}</code></div>
              </div>
              <button 
                className="px-4 py-2 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all shadow-sm" 
                onClick={()=>setShowEdit(true)}
              >
                ✏️ Edit
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-sm font-semibold text-slate-700">Per-kg Rate</div>
              <input 
                className="w-32 p-2 border-2 border-slate-200 rounded-lg font-semibold text-slate-800 disabled:bg-slate-50 disabled:text-slate-500" 
                type="number" 
                value={perKgDraft} 
                onChange={e=>setPerKgDraft(e.target.value)} 
                disabled={!perKgEditing} 
              />
              {!perKgEditing ? (
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all shadow-md" 
                  onClick={()=>{ setPerKgDraft(perKgRate); setPerKgEditing(true); }}
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-2 border-2 border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-all" 
                    onClick={()=>{ setPerKgEditing(false); setPerKgDraft(perKgRate); }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all shadow-md" 
                    onClick={()=>{ setPerKgRate(Number(perKgDraft||0)); setPerKgEditing(false); }}
                  >
                    💾 Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {toast && (
          <div className={`fixed right-6 top-6 z-50 p-4 rounded-xl shadow-2xl text-white font-semibold ${toast.type==='error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {toast.message}
          </div>
        )}

        {showEdit && (
          <div className="modal-overlay" onClick={()=>setShowEdit(false)}>
            <div className="modal bg-white p-6 rounded-2xl shadow-2xl" onClick={e=>e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Edit Shop Name</h3>
              <p className="text-sm text-slate-500 mb-4">Changing the name will create/point to a shop id slug.</p>
              <div className="mb-5">
                <input 
                  className="w-full p-3 border-2 border-slate-200 rounded-xl font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                  value={newShopName} 
                  onChange={e=>setNewShopName(e.target.value)} 
                  placeholder="Enter shop name"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  className="px-5 py-2 border-2 border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-all" 
                  onClick={()=>setShowEdit(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg" 
                  onClick={()=>{ renameShop(newShopName); setShowEdit(false); }}
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <section>
          {view === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-green-600 uppercase tracking-wide">Filled Cylinders</div>
                  <div className="text-3xl">🟢</div>
                </div>
                <div className="text-4xl font-bold text-green-700">{totalFilled}</div>
                <div className="text-xs text-green-600 mt-2">Ready for sale</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Empty Cylinders</div>
                  <div className="text-3xl">⚪</div>
                </div>
                <div className="text-4xl font-bold text-amber-700">{totalEmpty}</div>
                <div className="text-xs text-amber-600 mt-2">Awaiting refill</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Today's Sales</div>
                  <div className="text-3xl">💰</div>
                </div>
                <div className="text-3xl font-bold text-blue-700">{formatPKR(todaysSalesValue)}</div>
                <div className="text-xs text-blue-600 mt-2">{todaysTransactions.length} transactions</div>
              </div>
            </div>
          )}

          {view === 'inventory' && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-5">📦 Inventory Management</h3>
              <div className="space-y-4">
                {Object.entries(store.inventory).map(([type,st])=> (
                  <div key={type} className="bg-gradient-to-r from-slate-50 to-white p-5 border-2 border-slate-200 rounded-xl hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-slate-800 mb-2">{type} Cylinders</div>
                        <div className="flex gap-4 text-sm">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">✓ Filled: {st.filled}</span>
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg font-semibold">○ Empty: {st.empty}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all shadow-md" 
                          onClick={()=>{
                            const res = recordSale(type,1,perKgRate,'')
                            if(!res || !res.success){
                              setToast({ message: res && res.message ? res.message : 'Cylinder 0 hai — out of stock', type: 'error' })
                            } else {
                              setToast({ message: 'Sale recorded', type: 'success' })
                            }
                          }}
                        >
                          💸 Sell -1
                        </button>
                        <button 
                          className="px-4 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-all shadow-md" 
                          onClick={()=>{
                            setManagingEmpty(type)
                            setEmptyQty('')
                          }}
                        >
                          🔄 Manage Empty
                        </button>
                      </div>
                    </div>
                    {managingEmpty === type && (
                      <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                        <div className="text-sm font-semibold text-amber-800 mb-3">Refill Empty Cylinders</div>
                        <div className="flex items-center gap-3">
                          <input 
                            type="number" 
                            className="w-32 p-2 border-2 border-amber-300 rounded-lg font-semibold focus:border-amber-500 focus:ring-2 focus:ring-amber-200" 
                            placeholder="Quantity"
                            value={emptyQty}
                            onChange={(e)=>setEmptyQty(e.target.value)}
                            min="0"
                            max={st.empty}
                          />
                          <span className="text-sm text-amber-700">Available: {st.empty}</span>
                          <div className="flex gap-2 ml-auto">
                            <button 
                              className="px-4 py-2 border-2 border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-all" 
                              onClick={()=>{
                                setManagingEmpty(null)
                                setEmptyQty('')
                              }}
                            >
                              Cancel
                            </button>
                            <button 
                              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all shadow-md" 
                              onClick={()=>{
                                const result = manageEmpty(type, emptyQty)
                                if(result.success){
                                  setManagingEmpty(null)
                                  setEmptyQty('')
                                  setToast({ message: result.message, type: 'success' })
                                }else{
                                  setToast({ message: result.message, type: 'error' })
                                }
                              }}
                            >
                              ✓ Refill
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'shipments' && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold text-slate-800">📒 Khata Book (Udhar)</h3>
                <button 
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all shadow-md" 
                  onClick={()=>setShowHistory(true)}
                >
                  📜 History
                </button>
              </div>

              <div className="mb-5 flex gap-3">
                <input value={khataName} onChange={e=>setKhataName(e.target.value)} placeholder="Name" className="p-3 border-2 rounded-lg w-48" />
                <input value={khataKg} onChange={e=>setKhataKg(e.target.value)} placeholder="Kg" type="number" className="p-3 border-2 rounded-lg w-32" />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={()=>{
                  const res = addKhataEntry(khataName, khataKg, perKgRate)
                  if(res && res.success){ setToast({message: res.message, type:'success'}); setKhataName(''); setKhataKg('') }
                  else setToast({message: res.message || 'Error', type:'error'})
                }}>Add</button>
              </div>

              <div className="space-y-3">
                {Object.entries(store.khatabook || {}).length === 0 && <div className="text-slate-400">No khata entries yet</div>}
                {Object.entries(store.khatabook || {}).map(([name,data], idx)=> (
                  <div key={idx} className="flex items-center justify-between p-4 border-2 rounded-xl bg-gradient-to-r from-slate-50 to-white hover:shadow-lg transition-all">
                    <div>
                      <div className="font-bold text-lg text-slate-800">{name}</div>
                      <div className="flex gap-4 mt-1">
                        <span className="text-sm text-slate-600">Total Kg: <span className="font-semibold">{data.kg || 0} kg</span></span>
                        <span className="text-sm text-red-600">Total Udhar: <span className="font-bold">{formatPKR(data.amount || 0)}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {addingTo === name ? (
                        <>
                          <input type="number" value={addKgValue} onChange={e=>setAddKgValue(e.target.value)} placeholder="Kg" className="p-2 border-2 rounded-lg w-28" />
                          <button className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={()=>{
                            const res = addKhataEntry(name, addKgValue, perKgRate)
                            if(res && res.success){ setToast({message: res.message, type:'success'}); setAddingTo(null); setAddKgValue('') }
                            else setToast({message: res.message || 'Error', type:'error'})
                          }}>+ Add Kg</button>
                          <button className="px-3 py-2 border-2 rounded-lg hover:bg-slate-50" onClick={()=>{ setAddingTo(null); setAddKgValue('') }}>Cancel</button>
                        </>
                      ) : settlingName === name ? (
                        <>
                          <input type="number" value={settleAmount} onChange={e=>setSettleAmount(e.target.value)} placeholder="PKR" className="p-2 border-2 rounded-lg w-32" />
                          <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={()=>{
                            const res = settleKhata(name, settleAmount)
                            if(res && res.success){ setToast({message: res.message, type:'success'}); setSettlingName(null); setSettleAmount('') }
                            else setToast({message: res.message || 'Error', type:'error'})
                          }}>💰 Pay</button>
                          <button className="px-3 py-2 border-2 rounded-lg hover:bg-slate-50" onClick={()=>{ setSettlingName(null); setSettleAmount('') }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600" onClick={()=>{ setAddingTo(name); setAddKgValue('') }}>+ Add Kg</button>
                          <button className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={()=>{ setSettlingName(name); setSettleAmount('') }}>💳 Settle</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showHistory && (
            <div className="modal-overlay" onClick={()=>setShowHistory(false)}>
              <div className="modal bg-white p-6 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto" onClick={e=>e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-800">📜 Last Month Payment History</h3>
                  <button 
                    className="px-3 py-1 bg-slate-500 text-white rounded-lg hover:bg-slate-600" 
                    onClick={()=>setShowHistory(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                        <th className="py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Date</th>
                        <th className="py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Name</th>
                        <th className="py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Paid Amount</th>
                        <th className="py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const lastMonth = new Date()
                        lastMonth.setDate(lastMonth.getDate() - 30)
                        const lastMonthStr = lastMonth.toISOString().slice(0,10)
                        const historyTxns = store.transactions
                          .filter(t => t.type === 'settlement' && t.date >= lastMonthStr)
                          .sort((a,b) => b.date.localeCompare(a.date))
                        return historyTxns.map((t,i)=> {
                          const currentData = store.khatabook && store.khatabook[t.name] ? store.khatabook[t.name] : { amount: 0 }
                          const remaining = currentData.amount || 0
                          return (
                            <tr key={i} className="border-t border-slate-200 hover:bg-blue-50 transition-all">
                              <td className="py-3 px-4 text-sm text-slate-700 font-medium">{t.date}</td>
                              <td className="py-3 px-4 text-sm font-semibold text-slate-800">{t.name}</td>
                              <td className="py-3 px-4 text-sm font-bold text-green-600">{formatPKR(t.paid)}</td>
                              <td className="py-3 px-4 text-sm">
                                {remaining === 0 ? (
                                  <span className="text-green-600 font-bold">Clear</span>
                                ) : (
                                  <span className="text-red-600 font-bold">{formatPKR(remaining)}</span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      })()}
                      {(() => {
                        const lastMonth = new Date()
                        lastMonth.setDate(lastMonth.getDate() - 30)
                        const lastMonthStr = lastMonth.toISOString().slice(0,10)
                        return store.transactions.filter(t => t.type === 'settlement' && t.date >= lastMonthStr).length === 0
                      })() && (
                        <tr><td className="py-8 text-center text-slate-400" colSpan={4}>📝 No payments in last month</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === 'reports' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-blue-100">
                  <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Today's Sales</div>
                  <div className="text-3xl font-bold text-blue-700">{formatPKR(todaysSalesValue)}</div>
                  <div className="text-xs text-blue-600 mt-1">{todaysTransactions.length} transactions</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl shadow-lg border border-purple-100">
                  <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">Weekly Sales</div>
                  <div className="text-3xl font-bold text-purple-700">{formatPKR(weeklySales)}</div>
                  <div className="text-xs text-purple-600 mt-1">Last 7 days</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl shadow-lg border border-emerald-100">
                  <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">Total Transactions</div>
                  <div className="text-3xl font-bold text-emerald-700">{store.transactions.length}</div>
                  <div className="text-xs text-emerald-600 mt-1">All time</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-5">📊 Weekly Sales Chart</h3>
                <div className="space-y-3">
                  {(() => {
                    const weekDates = []
                    for(let i=6; i>=0; i--){
                      const d = new Date()
                      d.setDate(d.getDate() - i)
                      weekDates.push(d.toISOString().slice(0,10))
                    }
                    const salesByDay = weekDates.map(date => {
                      const daySales = store.transactions
                        .filter(t => t.type==='sale' && t.date===date)
                        .reduce((sum,t)=> sum + t.amount, 0)
                      return { date, sales: daySales }
                    })
                    const maxSale = Math.max(...salesByDay.map(d=>d.sales), 1)
                    
                    return salesByDay.map((day,i) => {
                      const barWidth = (day.sales / maxSale) * 100
                      const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-16 text-sm font-semibold text-slate-700">{dayName}</div>
                          <div className="flex-1 bg-slate-100 rounded-lg h-10 relative overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-lg transition-all duration-500 flex items-center px-3"
                              style={{ width: `${barWidth}%`, minWidth: day.sales > 0 ? '60px' : '0' }}
                            >
                              {day.sales > 0 && (
                                <span className="text-white font-bold text-sm">{formatPKR(day.sales)}</span>
                              )}
                            </div>
                          </div>
                          <div className="w-24 text-right text-xs text-slate-500">{day.date}</div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">🎯 Inventory Status</h3>
                  <div className="space-y-3">
                    {Object.entries(store.inventory).map(([type,st])=> {
                      const total = st.filled + st.empty
                      const filledPercent = total > 0 ? (st.filled / total) * 100 : 0
                      return (
                        <div key={type}>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-slate-700">{type}</span>
                            <span className="text-sm text-slate-600">{st.filled}/{total}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${filledPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span className="text-green-600">Filled: {st.filled}</span>
                            <span className="text-amber-600">Empty: {st.empty}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">📈 Transaction Types</h3>
                  <div className="space-y-4">
                    {['sale', 'shipment', 'refill'].map(type => {
                      const count = store.transactions.filter(t=>t.type===type).length
                      const total = store.transactions.length || 1
                      const percent = (count / total) * 100
                      const colors = {
                        sale: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-700', light: 'bg-blue-50' },
                        shipment: { bg: 'from-green-500 to-green-600', text: 'text-green-700', light: 'bg-green-50' },
                        refill: { bg: 'from-amber-500 to-amber-600', text: 'text-amber-700', light: 'bg-amber-50' }
                      }
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold uppercase ${colors[type].light} ${colors[type].text}`}>
                              {type}
                            </span>
                            <span className="text-sm font-bold text-slate-700">{count} ({percent.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className={`bg-gradient-to-r ${colors[type].bg} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'sales' && (
            <>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">Weekly Sales (Last 7 Days)</div>
                    <div className="text-4xl font-bold text-purple-700">{formatPKR(weeklySales)}</div>
                  </div>
                  <div className="text-5xl">📊</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-5">💰 Sales Records</h3>
                <div className="overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                        <th className="py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Date</th>
                        <th className="py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Qty</th>
                        <th className="py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Amount</th>
                        <th className="py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Rate (/kg)</th>
                        <th className="py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.transactions.filter(t=>t.type==='sale').map((s,i)=>(
                        <tr key={i} className="border-t border-slate-200 hover:bg-blue-50 transition-all">
                          <td className="py-3 px-4 text-sm text-slate-700 font-medium">{s.date}</td>
                          <td className="py-3 px-4 text-sm font-semibold">{s.qty}</td>
                          <td className="py-3 px-4 text-sm font-bold text-green-600">{formatPKR(s.amount)}</td>
                          <td className="py-3 px-4 text-sm text-slate-600">{formatPKR(s.ratePerKg)}</td>
                          <td className="py-3 px-4 text-sm text-slate-500">{s.note}</td>
                        </tr>
                      ))}
                      {store.transactions.filter(t=>t.type==='sale').length === 0 && (
                        <tr><td className="py-8 text-center text-slate-400" colSpan={5}>📝 No sales yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {view === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-5">⚙️ Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Owner Name</label>
                    <input
                      type="text"
                      value={session.ownerName || ''}
                      onChange={(e) => setSession({...session, ownerName: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter owner name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={session.phone || ''}
                      onChange={(e) => setSession({...session, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={session.address || ''}
                      onChange={(e) => setSession({...session, address: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter address"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      localStorage.setItem('lpg_session', JSON.stringify(session));
                      setToast({ message: 'Personal details saved successfully!', type: 'success' });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                  >
                    💾 Save Details
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-5">📦 Inventory Management</h3>
                <div className="space-y-6">
                  {Object.entries(store.inventory).map(([type, counts]) => (
                    <div key={type} className="border border-slate-200 rounded-lg p-4">
                      <h4 className="text-lg font-bold text-slate-700 mb-4">{type} Cylinders</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Filled Cylinders</label>
                          <input
                            type="number"
                            min="0"
                            value={inventoryEdits[type]?.filled ?? counts.filled}
                            onChange={(e) => setInventoryEdits({
                              ...inventoryEdits,
                              [type]: { ...inventoryEdits[type], filled: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Empty Cylinders</label>
                          <input
                            type="number"
                            min="0"
                            value={inventoryEdits[type]?.empty ?? counts.empty}
                            onChange={(e) => setInventoryEdits({
                              ...inventoryEdits,
                              [type]: { ...inventoryEdits[type], empty: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setInventoryEdits({});
                    }}
                    className="px-6 py-3 bg-slate-500 text-white font-bold rounded-lg hover:bg-slate-600 transition-all"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={() => {
                      const updates = {};
                      Object.entries(inventoryEdits).forEach(([type, counts]) => {
                        if (counts.filled !== undefined || counts.empty !== undefined) {
                          updates[type] = {
                            filled: counts.filled ?? store.inventory[type]?.filled ?? 0,
                            empty: counts.empty ?? store.inventory[type]?.empty ?? 0
                          };
                        }
                      });
                      if (Object.keys(updates).length > 0) {
                        const result = updateInventory(updates);
                        if (result.success) {
                          setToast({ message: result.message, type: 'success' });
                          setInventoryEdits({});
                        } else {
                          setToast({ message: result.message, type: 'error' });
                        }
                      } else {
                        setToast({ message: 'No changes to save', type: 'info' });
                      }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                  >
                    💾 Save Inventory
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
