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

export default function Dashboard({ session, renameShop, onLogout }){
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
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [inventoryModalData, setInventoryModalData] = useState({ type: '', total: 0, filled: 0, empty: 0 })
  const [localSession, setLocalSession] = useState(session)
  const [personalEditing, setPersonalEditing] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const currencyFmt = new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formatPKR = v => `PKR ${currencyFmt.format(Number(v) || 0)}`

  useEffect(()=>{
    setNewShopName(session.name)
  },[session.name])

  useEffect(()=>{
    setLocalSession(session)
  },[session])

  useEffect(()=>{
    if(!toast) return
    const t = setTimeout(()=>setToast(null), 3000)
    return ()=>clearTimeout(t)
  },[toast])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{animationDelay: '2s'}}></div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-white/10 backdrop-blur-3xl border-r border-white/30 shadow-2xl flex flex-col w-72 z-50 transform transition-all duration-300 ease-out lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 pb-5 border-b border-white/30 bg-gradient-to-br from-white/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-purple-500/60 animate-float-slow">
                {session.name.charAt(0)}
              </div>
            </div>
            <div>
              <div className="font-bold text-xl text-white drop-shadow-2xl">{session.name}</div>
              <div className="text-sm text-purple-300 font-semibold tracking-wide">Smart LPG</div>
            </div>
          </div>
          <button 
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-all duration-200 hover:scale-110"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-5 pt-6 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {NAV.map(n => (
              <div 
                key={n.id} 
                onClick={()=>{
                  setView(n.id)
                  setIsMobileMenuOpen(false)
                }} 
                className={`group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                  view===n.id 
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-2xl shadow-purple-500/60 scale-105' 
                    : 'hover:bg-white/15 text-white/80 hover:text-white hover:scale-105 hover:shadow-xl'
                }`}
              >
                {view === n.id && (
                  <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse"></div>
                )}
                <div className="relative w-10 text-center text-2xl transform group-hover:scale-110 transition-transform duration-300">{n.icon}</div>
                <div className="relative font-semibold text-base tracking-wide">{n.label}</div>
                {view === n.id && (
                  <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-5 pt-4 text-xs text-purple-300/80 text-center border-t border-white/30 font-semibold bg-gradient-to-t from-white/5 to-transparent">
          Smart LPG v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full lg:ml-72 relative z-10">
        <header className="bg-white/10 backdrop-blur-3xl shadow-2xl border-b border-white/30 px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-white/15 transition-all duration-200 hover:scale-110"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl blur opacity-75 animate-pulse"></div>
                  <div className="relative w-8 h-8 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center shadow-2xl shadow-purple-500/60">
                    <span className="text-white font-bold text-lg lg:text-2xl">🏪</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-lg lg:text-2xl font-bold text-white drop-shadow-2xl">
                    Smart<span className="text-purple-300"> LPG</span>
                  </h1>
                  <div className="text-xs text-purple-200/80 lg:hidden font-medium">Management System</div>
                </div>
              </div>
            </div>
          

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3 bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-sm font-bold text-white tracking-wide">Rate/kg</div>
                <input 
                  className="w-28 p-2 bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl text-sm font-semibold text-white disabled:bg-white/5 disabled:text-white/50 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" 
                  type="number" 
                  value={perKgDraft} 
                  onChange={e=>setPerKgDraft(e.target.value)} 
                  disabled={!perKgEditing} 
                  placeholder="0"
                />
                {!perKgEditing ? (
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/60 hover:scale-110" 
                    onClick={()=>{ setPerKgDraft(perKgRate); setPerKgEditing(true); }}
                  >
                    Edit
                  </button>
                ) : (
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-2 bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl text-sm font-semibold text-white hover:bg-white/25 transition-all duration-300 hover:scale-110" 
                    onClick={()=>{ setPerKgEditing(false); setPerKgDraft(perKgRate); }}
                  >
                    ✕
                  </button>
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/60 hover:scale-110" 
                    onClick={()=>{ setPerKgRate(Number(perKgDraft||0)); setPerKgEditing(false); }}
                  >
                    💾 Save
                  </button>
                </div>
              )}
              </div>
              
              {/* Logout Button */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <button 
                  onClick={onLogout}
                  className="relative px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-red-500/60 hover:scale-110"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Per-kg Rate */}
        <div className="lg:hidden bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-3xl border-b border-white/30 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white tracking-wide">Per-kg Rate</div>
            <div className="flex items-center gap-3">
              <input 
                className="w-20 p-2 bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl text-sm font-semibold text-white disabled:bg-white/5 disabled:text-white/50 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" 
                type="number" 
                value={perKgDraft} 
                onChange={e=>setPerKgDraft(e.target.value)} 
                disabled={!perKgEditing} 
                placeholder="0"
              />
              {!perKgEditing ? (
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:scale-110" 
                  onClick={()=>{ setPerKgDraft(perKgRate); setPerKgEditing(true); }}
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-2 bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl text-sm text-white hover:bg-white/25 transition-all duration-300 hover:scale-110" 
                    onClick={()=>{ setPerKgEditing(false); setPerKgDraft(perKgRate); }}
                  >
                    ✕
                  </button>
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:scale-110 transition-all duration-300" 
                    onClick={()=>{ setPerKgRate(Number(perKgDraft||0)); setPerKgEditing(false); }}
                  >
                    💾
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {toast && (
          <div className="fixed right-4 top-4 lg:right-6 lg:top-6 z-50 animate-slide-up">
            <div className={`relative overflow-hidden p-5 rounded-2xl shadow-2xl backdrop-blur-3xl text-white font-semibold max-w-sm border-2 ${
              toast.type==='error' 
                ? 'bg-gradient-to-r from-red-500/95 to-pink-500/95 border-red-400/60' 
                : 'bg-gradient-to-r from-green-500/95 to-emerald-500/95 border-green-400/60'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  toast.type==='error' ? 'bg-white/20' : 'bg-white/20'
                }`}>
                  {toast.type === 'error' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-base">{toast.message}</span>
              </div>
            </div>
          </div>
        )}

        {showEdit && (
          <div className="modal-overlay" onClick={()=>setShowEdit(false)}>
            <div className="relative animate-slide-up">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-3xl blur-xl"></div>
              <div className="modal relative bg-white/15 backdrop-blur-3xl border-2 border-white/30 p-8 rounded-3xl shadow-2xl" onClick={e=>e.stopPropagation()}>
                <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-2xl">Edit Shop Name</h3>
                <p className="text-sm text-purple-200/90 mb-6 font-medium">Changing the name will create/point to a shop id slug.</p>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-white/95 mb-3 tracking-wide">Shop Name</label>
                  <input 
                    className="w-full p-4 bg-white/15 backdrop-blur-xl border-2 border-white/30 rounded-2xl font-semibold text-white placeholder-white/60 focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all hover:bg-white/20" 
                    value={newShopName} 
                    onChange={e=>setNewShopName(e.target.value)} 
                    placeholder="Enter shop name"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button 
                    className="px-6 py-3 bg-white/15 backdrop-blur-xl border-2 border-white/30 rounded-2xl font-semibold text-white hover:bg-white/25 transition-all duration-300 hover:scale-105" 
                    onClick={()=>setShowEdit(false)}
                  >
                    Cancel
                  </button>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                    <button 
                      className="relative px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-purple-500/50 hover:scale-105" 
                      onClick={()=>{ renameShop(newShopName); setShowEdit(false); }}
                    >
                      💾 Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="flex-1 p-4 lg:p-6 overflow-auto">
          {view === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="group relative bg-gradient-to-br from-green-500/25 to-emerald-500/25 backdrop-blur-2xl p-7 rounded-3xl shadow-2xl border-2 border-green-400/40 hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold text-green-200 uppercase tracking-wider">Filled Cylinders</div>
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">🟢</div>
                  </div>
                  <div className="text-5xl font-extrabold text-white drop-shadow-2xl mb-2">{totalFilled}</div>
                  <div className="text-sm text-green-100 font-medium">Ready for sale</div>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-amber-500/25 to-orange-500/25 backdrop-blur-2xl p-7 rounded-3xl shadow-2xl border-2 border-amber-400/40 hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold text-amber-200 uppercase tracking-wider">Empty Cylinders</div>
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">⚪</div>
                  </div>
                  <div className="text-5xl font-extrabold text-white drop-shadow-2xl mb-2">{totalEmpty}</div>
                  <div className="text-sm text-amber-100 font-medium">Awaiting refill</div>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-blue-500/25 to-indigo-500/25 backdrop-blur-2xl p-7 rounded-3xl shadow-2xl border-2 border-blue-400/40 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold text-blue-200 uppercase tracking-wider">Today's Sales</div>
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">💰</div>
                  </div>
                  <div className="text-4xl font-extrabold text-white drop-shadow-2xl mb-2">{formatPKR(todaysSalesValue)}</div>
                  <div className="text-sm text-blue-100 font-medium">{todaysTransactions.length} transactions</div>
                </div>
              </div>
            </div>
          )}

          {view === 'inventory' && (
            <div className="bg-white/15 backdrop-blur-3xl p-6 lg:p-8 rounded-3xl shadow-2xl border-2 border-white/30">
              <h3 className="text-3xl font-extrabold text-white mb-6 drop-shadow-2xl flex items-center gap-3">
                <span>📦</span>
                <span>Inventory Management</span>
              </h3>
              <div className="space-y-5">
                {Object.entries(store.inventory).map(([type,st])=> (
                  <div key={type} className="group bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl p-6 lg:p-7 border-2 border-white/30 rounded-2xl hover:shadow-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-xl lg:text-2xl font-extrabold text-white mb-3 drop-shadow-lg">{type} Cylinders</div>
                        <div className="flex flex-wrap gap-2 lg:gap-4 text-sm">
                          <span className="px-3 py-1 bg-green-500/30 backdrop-blur-sm border border-green-400/50 text-green-200 rounded-lg font-semibold whitespace-nowrap">✓ Filled: {st.filled}</span>
                          <span className="px-3 py-1 bg-amber-500/30 backdrop-blur-sm border border-amber-400/50 text-amber-200 rounded-lg font-semibold whitespace-nowrap">○ Empty: {st.empty}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button 
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg text-sm lg:text-base whitespace-nowrap" 
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
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all shadow-lg text-sm lg:text-base whitespace-nowrap" 
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
                      <div className="mt-4 p-4 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-xl">
                        <div className="text-sm font-semibold text-amber-200 mb-3">Refill Empty Cylinders</div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              className="w-24 sm:w-32 p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400 focus:outline-none" 
                              placeholder="Qty"
                              value={emptyQty}
                              onChange={(e)=>setEmptyQty(e.target.value)}
                              min="0"
                              max={st.empty}
                            />
                            <span className="text-xs sm:text-sm text-amber-200 whitespace-nowrap">Available: {st.empty}</span>
                          </div>
                          <div className="flex gap-2 sm:ml-auto">
                            <button 
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium text-white hover:bg-white/20 transition-all text-sm" 
                              onClick={()=>{
                                setManagingEmpty(null)
                                setEmptyQty('')
                              }}
                            >
                              Cancel
                            </button>
                            <button 
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all shadow-lg text-sm" 
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
            <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold text-white drop-shadow-lg">📒 Khata Book (Udhar)</h3>
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-lg" 
                  onClick={()=>setShowHistory(true)}
                >
                  📜 History
                </button>
              </div>

              <div className="mb-5 flex flex-col sm:flex-row gap-3">
                <input value={khataName} onChange={e=>setKhataName(e.target.value)} placeholder="Name" className="flex-1 sm:w-48 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
                <input value={khataKg} onChange={e=>setKhataKg(e.target.value)} placeholder="Kg" type="number" className="flex-1 sm:w-32 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-lg whitespace-nowrap" onClick={()=>{
                  const res = addKhataEntry(khataName, khataKg, perKgRate)
                  if(res && res.success){ setToast({message: res.message, type:'success'}); setKhataName(''); setKhataKg('') }
                  else setToast({message: res.message || 'Error', type:'error'})
                }}>Add</button>
              </div>

              <div className="space-y-3">
                {Object.entries(store.khatabook || {}).length === 0 && <div className="text-purple-200">No khata entries yet</div>}
                {Object.entries(store.khatabook || {}).map(([name,data], idx)=> (
                  <div key={idx} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 hover:shadow-lg transition-all">
                    <div className="flex-1">
                      <div className="font-bold text-base lg:text-lg text-white drop-shadow-md">{name}</div>
                      <div className="flex flex-wrap gap-2 lg:gap-4 mt-1">
                        <span className="text-xs lg:text-sm text-purple-200 whitespace-nowrap">Total Kg: <span className="font-semibold text-white">{data.kg || 0} kg</span></span>
                        <span className="text-xs lg:text-sm text-red-300 whitespace-nowrap">Total Udhar: <span className="font-bold text-red-200">{formatPKR(data.amount || 0)}</span></span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      {addingTo === name ? (
                        <>
                          <input type="number" value={addKgValue} onChange={e=>setAddKgValue(e.target.value)} placeholder="Kg" className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg w-full sm:w-28 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
                          <button className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-lg text-sm whitespace-nowrap" onClick={()=>{
                            const res = addKhataEntry(name, addKgValue, perKgRate)
                            if(res && res.success){ setToast({message: res.message, type:'success'}); setAddingTo(null); setAddKgValue('') }
                            else setToast({message: res.message || 'Error', type:'error'})
                          }}>+ Add Kg</button>
                          <button className="flex-1 sm:flex-none px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 text-sm" onClick={()=>{ setAddingTo(null); setAddKgValue('') }}>Cancel</button>
                        </>
                      ) : settlingName === name ? (
                        <>
                          <input type="number" value={settleAmount} onChange={e=>setSettleAmount(e.target.value)} placeholder="PKR" className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg w-full sm:w-32 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
                          <button className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-lg text-sm whitespace-nowrap" onClick={()=>{
                            const res = settleKhata(name, settleAmount)
                            if(res && res.success){ setToast({message: res.message, type:'success'}); setSettlingName(null); setSettleAmount('') }
                            else setToast({message: res.message || 'Error', type:'error'})
                          }}>💰 Pay</button>
                          <button className="flex-1 sm:flex-none px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 text-sm" onClick={()=>{ setSettlingName(null); setSettleAmount('') }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg shadow-lg text-sm whitespace-nowrap" onClick={()=>{ setAddingTo(name); setAddKgValue('') }}>+ Add Kg</button>
                          <button className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-lg text-sm whitespace-nowrap" onClick={()=>{ setSettlingName(name); setSettleAmount('') }}>💳 Settle</button>
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
              <div className="modal bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto" onClick={e=>e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">📜 Last Month Payment History</h3>
                  <button 
                    className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg shadow-lg" 
                    onClick={()=>setShowHistory(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/10 backdrop-blur-sm">
                        <th className="py-3 px-4 text-sm font-bold text-purple-200 uppercase tracking-wide">Date</th>
                        <th className="py-3 px-4 text-sm font-bold text-purple-200 uppercase tracking-wide">Name</th>
                        <th className="py-3 px-4 text-sm font-bold text-purple-200 uppercase tracking-wide">Paid Amount</th>
                        <th className="py-3 px-4 text-sm font-bold text-purple-200 uppercase tracking-wide">Remaining</th>
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
                            <tr key={i} className="border-t border-white/20 hover:bg-white/10 transition-all">
                              <td className="py-3 px-4 text-sm text-purple-200 font-medium">{t.date}</td>
                              <td className="py-3 px-4 text-sm font-semibold text-white">{t.name}</td>
                              <td className="py-3 px-4 text-sm font-bold text-green-300">{formatPKR(t.paid)}</td>
                              <td className="py-3 px-4 text-sm">
                                {remaining === 0 ? (
                                  <span className="text-green-300 font-bold">Clear</span>
                                ) : (
                                  <span className="text-red-300 font-bold">{formatPKR(remaining)}</span>
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
                        <tr><td className="py-8 text-center text-purple-200" colSpan={4}>📝 No payments in last month</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === 'reports' && (
            <div className="space-y-4 lg:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-blue-400/30">
                  <div className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-2">Today's Sales</div>
                  <div className="text-3xl font-bold text-white drop-shadow-lg">{formatPKR(todaysSalesValue)}</div>
                  <div className="text-xs text-blue-200 mt-1">{todaysTransactions.length} transactions</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-purple-400/30">
                  <div className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-2">Weekly Sales</div>
                  <div className="text-3xl font-bold text-white drop-shadow-lg">{formatPKR(weeklySales)}</div>
                  <div className="text-xs text-purple-200 mt-1">Last 7 days</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-emerald-400/30">
                  <div className="text-sm font-semibold text-emerald-300 uppercase tracking-wide mb-2">Total Transactions</div>
                  <div className="text-3xl font-bold text-white drop-shadow-lg">{store.transactions.length}</div>
                  <div className="text-xs text-emerald-200 mt-1">All time</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-2xl p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20">
                <h3 className="text-lg lg:text-2xl font-bold text-white mb-4 lg:mb-5 drop-shadow-lg">📊 Weekly Sales Chart</h3>
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
                          <div className="w-16 text-sm font-semibold text-white">{dayName}</div>
                          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg h-10 relative overflow-hidden border border-white/20">
                            <div 
                              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-lg transition-all duration-500 flex items-center px-3"
                              style={{ width: `${barWidth}%`, minWidth: day.sales > 0 ? '60px' : '0' }}
                            >
                              {day.sales > 0 && (
                                <span className="text-white font-bold text-sm drop-shadow-md">{formatPKR(day.sales)}</span>
                              )}
                            </div>
                          </div>
                          <div className="w-24 text-right text-xs text-purple-200">{day.date}</div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">🎯 Inventory Status</h3>
                  <div className="space-y-3">
                    {Object.entries(store.inventory).map(([type,st])=> {
                      const total = st.filled + st.empty
                      const filledPercent = total > 0 ? (st.filled / total) * 100 : 0
                      return (
                        <div key={type}>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-white">{type}</span>
                            <span className="text-sm text-purple-200">{st.filled}/{total}</span>
                          </div>
                          <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-4 overflow-hidden border border-white/20">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${filledPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span className="text-green-300">Filled: {st.filled}</span>
                            <span className="text-amber-300">Empty: {st.empty}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">📈 Transaction Types</h3>
                  <div className="space-y-4">
                    {['sale', 'shipment', 'refill'].map(type => {
                      const count = store.transactions.filter(t=>t.type===type).length
                      const total = store.transactions.length || 1
                      const percent = (count / total) * 100
                      const colors = {
                        sale: { bg: 'from-blue-500 to-indigo-500', text: 'text-blue-200', light: 'bg-blue-500/30' },
                        shipment: { bg: 'from-green-500 to-emerald-500', text: 'text-green-200', light: 'bg-green-500/30' },
                        refill: { bg: 'from-amber-500 to-orange-500', text: 'text-amber-200', light: 'bg-amber-500/30' }
                      }
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold uppercase backdrop-blur-sm border border-white/20 ${colors[type].light} ${colors[type].text}`}>
                              {type}
                            </span>
                            <span className="text-sm font-bold text-white">{count} ({percent.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-white/20">
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
              <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-xl p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg border border-purple-400/30 hover:shadow-xl hover:shadow-purple-500/20 transition-all mb-4 lg:mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs lg:text-sm font-semibold text-purple-300 uppercase tracking-wide mb-2">Weekly Sales (Last 7 Days)</div>
                    <div className="text-2xl lg:text-4xl font-bold text-white drop-shadow-lg">{formatPKR(weeklySales)}</div>
                  </div>
                  <div className="text-3xl lg:text-5xl">📊</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-2xl p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-5 drop-shadow-lg">💰 Sales Records</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-white/10 backdrop-blur-sm">
                        <th className="py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-bold text-purple-200 uppercase tracking-wide">Date</th>
                        <th className="py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-bold text-purple-200 uppercase tracking-wide">Qty</th>
                        <th className="py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-bold text-purple-200 uppercase tracking-wide">Amount</th>
                        <th className="py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-bold text-purple-200 uppercase tracking-wide">Rate (/kg)</th>
                        <th className="py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm font-bold text-purple-200 uppercase tracking-wide">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.transactions.filter(t=>t.type==='sale').map((s,i)=>(
                        <tr key={i} className="border-t border-white/20 hover:bg-white/10 transition-all">
                          <td className="py-3 px-4 text-sm text-purple-200 font-medium">{s.date}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-white">{s.qty}</td>
                          <td className="py-3 px-4 text-sm font-bold text-green-300">{formatPKR(s.amount)}</td>
                          <td className="py-3 px-4 text-sm text-purple-200">{formatPKR(s.ratePerKg)}</td>
                          <td className="py-3 px-4 text-sm text-purple-200">{s.note}</td>
                        </tr>
                      ))}
                      {store.transactions.filter(t=>t.type==='sale').length === 0 && (
                        <tr><td className="py-8 text-center text-purple-200" colSpan={5}>📝 No sales yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {view === 'settings' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white/10 backdrop-blur-2xl p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">⚙️ Personal Details</h3>
                  <div>
                    {!personalEditing ? (
                      <button
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-lg"
                        onClick={() => setPersonalEditing(true)}
                      >
                        ✏️ Edit
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-lg"
                          onClick={() => {
                            // persist changes
                            if(!localSession || !localSession.name){
                              setToast({ message: 'Shop name is required', type: 'error' })
                              return
                            }
                            if(localSession.name !== session.name){
                              renameShop(localSession.name)
                            }
                            const toSave = { ...session, name: localSession.name, ownerName: localSession.ownerName, phone: localSession.phone, address: localSession.address }
                            localStorage.setItem('lpg_session', JSON.stringify(toSave))
                            setPersonalEditing(false)
                            setToast({ message: 'Personal details saved successfully!', type: 'success' })
                          }}
                        >
                          💾 Save
                        </button>
                        <button
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-lg"
                          onClick={() => {
                            setPersonalEditing(false)
                            setLocalSession(session)
                          }}
                        >
                          ✖ Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {(!localSession || !localSession.name || !localSession.ownerName || !localSession.phone) && !personalEditing ? (
                  <div className="p-4 mb-4 rounded-lg bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 text-amber-200">Please add shop name, owner name and phone number. Click <strong>Edit</strong> to add details.</div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Shop Name</label>
                    <input
                      type="text"
                      value={localSession?.name || ''}
                      onChange={(e) => setLocalSession({...localSession, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all disabled:bg-white/5 disabled:text-white/50"
                      placeholder="Enter shop name"
                      disabled={!personalEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Owner Name</label>
                    <input
                      type="text"
                      value={localSession?.ownerName || ''}
                      onChange={(e) => setLocalSession({...localSession, ownerName: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all disabled:bg-white/5 disabled:text-white/50"
                      placeholder="Enter owner name"
                      disabled={!personalEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={localSession?.phone || ''}
                      onChange={(e) => setLocalSession({...localSession, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all disabled:bg-white/5 disabled:text-white/50"
                      placeholder="Enter phone number"
                      disabled={!personalEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Address</label>
                    <input
                      type="text"
                      value={localSession?.address || ''}
                      onChange={(e) => setLocalSession({...localSession, address: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all disabled:bg-white/5 disabled:text-white/50"
                      placeholder="Enter address"
                      disabled={!personalEditing}
                    />
                  </div>
                </div>
                
              </div>

              <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-5 drop-shadow-lg">📦 Inventory Management</h3>
                <div className="space-y-6">
                  {Object.entries(store.inventory).map(([type, counts]) => {
                    const total = (counts.filled || 0) + (counts.empty || 0)
                    const isEditing = inventoryEdits[type]?.editing
                    const draftTotal = inventoryEdits[type]?.total ?? total
                    const filledPercent = total > 0 ? ((counts.filled || 0) / total) * 100 : 0
                    return (
                      <div key={type} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:bg-white/15 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-md">
                            <span className="text-2xl">🛢️</span> {type} Cylinders
                          </h4>
                          {!isEditing && (
                            <button
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-lg"
                              onClick={() => setInventoryEdits({ ...inventoryEdits, [type]: { ...(inventoryEdits[type] || {}), editing: true, total } })}
                            >
                              ✏️ Edit Total
                            </button>
                          )}
                        </div>

                        {!isEditing ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-semibold text-purple-200">Total Cylinders: <span className="text-white">{total}</span></div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-green-300 font-medium">Filled: {counts.filled || 0}</span>
                                <span className="text-amber-300 font-medium">Empty: {counts.empty || 0}</span>
                              </div>
                              <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-4 overflow-hidden border border-white/20">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${filledPercent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-4">
                            <div className="text-sm text-blue-200 mb-3">Enter new total cylinders. You'll be asked to specify how many are filled and empty.</div>
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <label className="block text-sm font-semibold text-white mb-2">Total Cylinders</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={draftTotal}
                                  onChange={(e) => setInventoryEdits({ ...inventoryEdits, [type]: { ...(inventoryEdits[type] || {}), editing: true, total: parseInt(e.target.value) || 0 } })}
                                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all text-lg font-semibold"
                                  placeholder="e.g., 30"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <button
                                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all shadow-lg font-semibold"
                                  onClick={() => {
                                    const newTotal = Number(inventoryEdits[type]?.total ?? 0)
                                    if (isNaN(newTotal) || newTotal < 0) {
                                      setToast({ message: 'Invalid total', type: 'error' })
                                      return
                                    }
                                    setInventoryModalData({ type, total: newTotal, filled: 0, empty: newTotal })
                                    setShowInventoryModal(true)
                                  }}
                                >
                                  💾 Save
                                </button>
                                <button
                                  className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-lg transition-all font-semibold"
                                  onClick={() => {
                                    const copy = { ...inventoryEdits }
                                    delete copy[type]
                                    setInventoryEdits(copy)
                                  }}
                                >
                                  ✖ Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {showInventoryModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInventoryModal(false)}>
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Set Cylinder Distribution</h3>
                <p className="text-sm text-purple-200 mb-5">Total {inventoryModalData.type} cylinders: {inventoryModalData.total}</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Filled Cylinders</label>
                    <input
                      type="number"
                      min="0"
                      max={inventoryModalData.total}
                      value={inventoryModalData.filled}
                      onChange={(e) => {
                        const filled = Math.min(Number(e.target.value) || 0, inventoryModalData.total)
                        const empty = inventoryModalData.total - filled
                        setInventoryModalData({ ...inventoryModalData, filled, empty })
                      }}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Empty Cylinders</label>
                    <input
                      type="number"
                      min="0"
                      max={inventoryModalData.total}
                      value={inventoryModalData.empty}
                      onChange={(e) => {
                        const empty = Math.min(Number(e.target.value) || 0, inventoryModalData.total)
                        const filled = inventoryModalData.total - empty
                        setInventoryModalData({ ...inventoryModalData, filled, empty })
                      }}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:outline-none transition-all"
                    />
                  </div>
                  <div className="text-sm text-purple-200">
                    Filled + Empty = {inventoryModalData.filled + inventoryModalData.empty} (must equal {inventoryModalData.total})
                  </div>
                </div>
                <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                  <button
                    className="px-4 lg:px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg lg:rounded-xl font-medium text-white hover:bg-white/20 transition-all"
                    onClick={() => setShowInventoryModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 lg:px-5 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-lg lg:rounded-xl font-medium transition-all shadow-lg"
                    onClick={() => {
                      if (inventoryModalData.filled + inventoryModalData.empty !== inventoryModalData.total) {
                        setToast({ message: 'Filled + Empty must equal total', type: 'error' })
                        return
                      }
                      const res = updateInventory(inventoryModalData.type, inventoryModalData.filled, inventoryModalData.empty)
                      if (res && res.success) {
                        setToast({ message: res.message, type: 'success' })
                        setShowInventoryModal(false)
                        const copy = { ...inventoryEdits }
                        delete copy[inventoryModalData.type]
                        setInventoryEdits(copy)
                      } else {
                        setToast({ message: (res && res.message) || 'Failed to update', type: 'error' })
                      }
                    }}
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
