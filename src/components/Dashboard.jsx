import React, { useEffect, useState } from 'react'
import { useStore } from '../hooks/useStore'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import { DollarSign, Package, CheckCircle, X, Save, TrendingUp, Target, BarChart3, Edit, Edit2, Settings as SettingsIcon, FileText, Circle, ShoppingCart, RefreshCw, BookOpen, History, Trash2, Download } from 'lucide-react'

export default function Dashboard({ session, renameShop, updateShopDetails, onLogout }) {
  const { store, loading, todaysTransactions, todaysSalesValue, weeklySales, totalFilled, totalEmpty, recordSale, manageEmpty, addKhataEntry, settleKhata, updateInventory, updatePerKgRate, deleteSale } = useStore(session.id)

  const downloadCustomerPDF = (customerName) => {
    const txns = store.transactions
      .filter(t => (t.type === 'khata' || t.type === 'settlement') && t.name === customerName)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))

    const customerData = store.khatabook && store.khatabook[customerName] ? store.khatabook[customerName] : { kg: 0, amount: 0 }

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to download the PDF slip!')
      return
    }

    const todayStr = new Date().toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    let rowsHTML = ''
    txns.forEach(t => {
      const dateObj = new Date(t.date)
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
      const typeLabel = t.type === 'khata' ? 'Udhar (Credit)' : 'Settle (Paid)'
      const qtyText = t.qty ? `${Number(t.qty).toFixed(2)} kg` : '-'
      const rateText = t.rate_per_kg ? `PKR ${t.rate_per_kg}` : '-'
      const amountText = t.amount ? `PKR ${t.amount.toLocaleString()}` : 'PKR 0.00'
      const amountClass = t.type === 'khata' ? 'text-red' : 'text-green'
      
      rowsHTML += `
        <tr>
          <td>${t.date} (${dayName})</td>
          <td><span class="badge ${t.type}">${typeLabel}</span></td>
          <td>${qtyText}</td>
          <td>${rateText}</td>
          <td class="font-bold ${amountClass}">${amountText}</td>
        </tr>
      `
    })

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Udhar_Slip_${customerName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          body {
            font-family: 'Outfit', sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 40px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #ef4444;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .logo-section h1 {
            font-size: 28px;
            font-weight: 800;
            margin: 0;
            color: #4f46e5;
            letter-spacing: -0.5px;
          }
          .logo-section p {
            margin: 5px 0 0 0;
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .meta-section {
            text-align: right;
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
          }
          .meta-section strong {
            color: #1e293b;
          }
          .title {
            text-align: center;
            font-size: 20px;
            font-weight: 800;
            color: #ef4444;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 25px;
          }
          .details-box {
            display: flex;
            justify-content: space-between;
            background: #f8fafc;
            border-radius: 12px;
            padding: 15px 20px;
            margin-bottom: 25px;
            border: 1px solid #e2e8f0;
          }
          .details-box div {
            font-size: 14px;
            color: #64748b;
          }
          .details-box div strong {
            color: #1e293b;
            font-size: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background: #f1f5f9;
            color: #475569;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #cbd5e1;
          }
          td {
            padding: 12px;
            font-size: 13px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
          }
          .badge {
            font-size: 10px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 6px;
            text-transform: uppercase;
          }
          .badge.khata {
            background: #fee2e2;
            color: #b91c1c;
          }
          .badge.settlement {
            background: #d1fae5;
            color: #065f46;
          }
          .text-red {
            color: #ef4444;
          }
          .text-green {
            color: #16a34a;
          }
          .summary-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          .summary-card {
            background: #fff8f8;
            border: 1px solid #fee2e2;
            border-radius: 12px;
            padding: 15px 20px;
            min-width: 250px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
            color: #64748b;
          }
          .summary-row.total {
            margin-top: 10px;
            border-top: 1px solid #fca5a5;
            padding-top: 10px;
            font-size: 16px;
            font-weight: 800;
            color: #b91c1c;
          }
          .footer-note {
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            padding: 0 20px;
          }
          .sig-line {
            width: 180px;
            border-top: 1px solid #cbd5e1;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            padding-top: 8px;
            margin-top: 40px;
          }
          @media print {
            body { padding: 0; }
            .container { border: none; box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-section">
              <h1>${session.name || 'Smart LPG'}</h1>
              <p>Gas Cylinder Management System</p>
            </div>
            <div class="meta-section">
              Slip Date: <strong>${todayStr}</strong><br />
              Shop ID: <strong>${session.id.slice(0, 8)}</strong>
            </div>
          </div>
          
          <div class="title">Udhar Ledger (Khata Book Slip)</div>
          
          <div class="details-box">
            <div>
              Customer Name: <br />
              <strong>${customerName}</strong>
            </div>
            <div style="text-align: right;">
              Current Rate per Kg: <br />
              <strong>PKR ${Number(store.perKgRate || 0).toLocaleString()}</strong>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Date & Day</th>
                <th>Type</th>
                <th>Weight (Kg)</th>
                <th>Rate/Kg</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML || '<tr><td colspan="5" style="text-align: center; color: #94a3b8;">No chronological ledger entries registered.</td></tr>'}
            </tbody>
          </table>
          
          <div class="summary-container">
            <div class="summary-card">
              <div class="summary-row">
                <span>Total Gas Borrowed:</span>
                <strong style="color: #1e293b;">${Number(customerData.kg || 0).toFixed(2)} kg</strong>
              </div>
              <div class="summary-row total">
                <span>Total Net Udhar:</span>
                <span>PKR ${Number(customerData.amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="signature-section">
            <div class="sig-line">Customer Signature</div>
            <div class="sig-line">Authorized Stamp/Signature</div>
          </div>
          
          <div class="footer-note">
            This is a system generated transaction ledger slip for ${session.name}. Thank you for your business.
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

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

  useEffect(() => {
    setNewShopName(session.name)
  }, [session.name])

  useEffect(() => {
    setLocalSession(session)
  }, [session])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (store && store.perKgRate !== undefined) {
      setPerKgRate(store.perKgRate)
      setPerKgDraft(store.perKgRate)
    }
  }, [store])

  return (
    <div className="flex min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Sidebar (Desktop navigation) */}
      <Sidebar
        session={session}
        activeView={view}
        onViewChange={setView}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeView={view} onViewChange={setView} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full lg:ml-[268px]">
        {/* Navbar */}
        <Navbar
          session={session}
          onMenuToggle={() => setIsMobileMenuOpen(true)}
          onLogout={onLogout}
          onSettingsClick={() => setView('settings')}
        />

        {/* Mobile Per-kg Rate strip */}
        <div className="lg:hidden px-4 py-3"
          style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Per-kg Rate</span>
            <div className="flex items-center gap-2">
              <input
                className="w-20 px-2 py-1 text-sm font-bold text-slate-900 focus:outline-none transition-all"
                style={{
                  background: perKgEditing ? '#f5f3ff' : '#f8fafc',
                  border: perKgEditing ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                  borderRadius: '12px'
                }}
                type="number"
                value={perKgDraft}
                onChange={e => setPerKgDraft(e.target.value)}
                disabled={!perKgEditing}
                placeholder="0"
              />
              {!perKgEditing ? (
                <button
                  className="px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-indigo-700 shadow-sm"
                  style={{ background: '#4f46e5', borderRadius: '12px' }}
                  onClick={() => { setPerKgDraft(perKgRate); setPerKgEditing(true); }}
                >Edit</button>
              ) : (
                <>
                  <button
                    className="w-7 h-7 flex items-center justify-center transition-all bg-slate-100 border hover:bg-slate-200 text-slate-600"
                    style={{ borderRadius: '12px' }}
                    onClick={() => { setPerKgEditing(false); setPerKgDraft(perKgRate); }}
                  ><X className="w-3.5 h-3.5" /></button>
                  <button
                    className="px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-green-700 flex items-center gap-1 shadow-sm"
                    style={{ background: '#16a34a', borderRadius: '12px' }}
                    onClick={async () => {
                      const newRate = Number(perKgDraft || 0)
                      setPerKgRate(newRate)
                      await updatePerKgRate(newRate)
                      setPerKgEditing(false)
                    }}
                  ><Save className="w-3.5 h-3.5" /> Save</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        {toast && (
          <div className="fixed right-4 top-4 lg:right-6 lg:top-20 z-50 animate-slide-up">
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold shadow-lg max-w-xs border-l-4"
              style={{
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                borderRight: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
                borderColor: toast.type === 'error' ? '#ef4444' : '#10b981',
                color: '#1e293b',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" 
                style={{ background: toast.type === 'error' ? '#fee2e2' : '#d1fae5' }}>
                {toast.type === 'error'
                  ? <X className="w-3.5 h-3.5 text-red-600" />
                  : <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              {toast.message}
            </div>
          </div>
        )}

        {/* Edit Shop Modal */}
        {showEdit && (
          <div className="modal-overlay" onClick={() => setShowEdit(false)}>
            <div className="modal p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Edit Shop Name</h3>
              <p className="text-xs text-slate-500 mb-5">Changing the name will update the establishment profile database.</p>
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 mb-2 tracking-wide uppercase">Shop Name</label>
                <input
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                  value={newShopName}
                  onChange={e => setNewShopName(e.target.value)}
                  placeholder="Enter shop name"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5"
                  onClick={async () => { await renameShop(newShopName); setShowEdit(false); }}
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* content window container optimized with bottom offset for mobileBottomNav */}
        <section className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 lg:pb-6 overflow-auto space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-xs font-semibold text-slate-500">Syncing with cloud database...</span>
            </div>
          ) : (
            <>
              {view === 'overview' && (
                <div className="space-y-6">
                  {/* Per-kg rate - desktop */}
                  <div className="hidden lg:flex items-center justify-between px-5 py-4 rounded-xl border"
                    style={{ background: '#ffffff', borderColor: '#e2e8f0' }}>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Per-kg Rate</div>
                      {!perKgEditing
                        ? <div className="text-2xl font-bold text-slate-900">PKR {perKgRate.toLocaleString()}</div>
                        : <input
                          className="w-32 px-3 py-1 text-lg font-bold text-slate-900 border border-indigo-300 bg-indigo-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          style={{ borderRadius: '12px' }}
                          type="number" value={perKgDraft}
                          onChange={e => setPerKgDraft(e.target.value)} autoFocus
                        />
                      }
                    </div>
                    <div className="flex gap-2">
                      {!perKgEditing ? (
                        <button
                          className="px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-700 shadow-md"
                          style={{ background: '#4f46e5', borderRadius: '12px' }}
                          onClick={() => { setPerKgDraft(perKgRate); setPerKgEditing(true); }}
                        >Edit Rate</button>
                      ) : (
                        <>
                          <button
                            className="px-3.5 py-2 text-sm text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 transition-all flex items-center gap-1"
                            style={{ borderRadius: '12px' }}
                            onClick={() => { setPerKgEditing(false); setPerKgDraft(perKgRate); }}
                          ><X className="w-4 h-4" /> Cancel</button>
                          <button
                            className="px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-700 flex items-center gap-1.5 shadow-md"
                            style={{ background: '#16a34a', borderRadius: '12px' }}
                            onClick={async () => {
                              const newRate = Number(perKgDraft || 0)
                              setPerKgRate(newRate)
                              await updatePerKgRate(newRate)
                              setPerKgEditing(false)
                            }}
                          ><Save className="w-4 h-4" /> Save</button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {/* Filled cylinders */}
                    <div className="stat-card animate-fade-in-up">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: '#d1fae5' }}>
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: '#e2fbf0', color: '#047857', border: '1px solid #a7f3d0' }}>
                          Filled
                        </span>
                      </div>
                      <div className="text-4xl font-extrabold text-slate-900 mb-1">{totalFilled}</div>
                      <div className="text-xs font-semibold text-emerald-600">Ready for sale</div>
                    </div>

                    {/* Empty cylinders */}
                    <div className="stat-card animate-fade-in-up">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: '#fef3c7' }}>
                          <Circle className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
                          Empty
                        </span>
                      </div>
                      <div className="text-4xl font-extrabold text-slate-900 mb-1">{totalEmpty}</div>
                      <div className="text-xs font-semibold text-amber-600">Awaiting refill</div>
                    </div>

                    {/* Today's sales */}
                    <div className="stat-card animate-fade-in-up sm:col-span-2 lg:col-span-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: '#e0e7ff' }}>
                          <DollarSign className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>
                          Today
                        </span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 mb-1">{formatPKR(todaysSalesValue)}</div>
                      <div className="text-xs font-semibold text-indigo-600">{todaysTransactions.length} transactions today</div>
                    </div>
                  </div>
                </div>
              )}

              {view === 'inventory' && (
                <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Package className="w-6 h-6 text-indigo-600" />
                    <span>Inventory Management</span>
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(store.inventory).map(([type, st]) => (
                      <div key={type} className="bg-white p-4 sm:p-5 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-lg font-bold text-slate-800 mb-2">{type} Cylinders</div>
                            <div className="flex flex-wrap gap-3 text-xs">
                              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Filled: {st.filled}</span>
                              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-md font-semibold">Empty: {st.empty}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <button
                              className="px-4 py-3 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md text-sm flex items-center justify-center gap-1.5"
                              style={{ borderRadius: '12px' }}
                              onClick={async () => {
                                const result = await recordSale(type, 1, perKgRate, `Direct sale of 1x ${type}`)
                                if (!result.success) {
                                  setToast({ message: result.message, type: 'error' })
                                } else {
                                  setToast({ message: 'Sale recorded', type: 'success' })
                                }
                              }}
                            >
                              <ShoppingCart className="w-4 h-4" /> Sell -1
                            </button>
                            <button
                              className="px-4 py-3 sm:py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all shadow-md text-sm flex items-center justify-center gap-1.5"
                              style={{ borderRadius: '12px' }}
                              onClick={() => {
                                setManagingEmpty(type)
                                setEmptyQty('')
                              }}
                            >
                              <RefreshCw className="w-4 h-4" /> Manage Empty
                            </button>
                          </div>
                        </div>
                        {managingEmpty === type && (
                          <div className="mt-4 p-4 bg-slate-50 border border-slate-200" style={{ borderRadius: '16px' }}>
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Refill Empty Cylinders</div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <input
                                  type="number"
                                  className="w-24 sm:w-32 p-2.5 bg-white border border-slate-300 font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm"
                                  style={{ borderRadius: '12px' }}
                                  placeholder="Qty"
                                  value={emptyQty}
                                  onChange={(e) => setEmptyQty(e.target.value)}
                                  min="0"
                                  max={st.empty}
                                />
                                <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Available Empty: {st.empty}</span>
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                                <button
                                  className="flex-1 sm:flex-none px-3 py-2 border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition-all text-xs"
                                  style={{ borderRadius: '12px' }}
                                  onClick={() => {
                                    setManagingEmpty(null)
                                    setEmptyQty('')
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="flex-1 sm:flex-none px-3.5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-md text-xs flex items-center justify-center gap-1.5"
                                  style={{ borderRadius: '12px' }}
                                  onClick={async () => {
                                    const result = await manageEmpty(type, emptyQty)
                                    if (result.success) {
                                      setManagingEmpty(null)
                                      setEmptyQty('')
                                      setToast({ message: result.message, type: 'success' })
                                    } else {
                                      setToast({ message: result.message, type: 'error' })
                                    }
                                  }}
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Refill
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
                <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><BookOpen className="w-6 h-6 text-indigo-600" /> Khata Book (Udhar)</h3>
                    <button
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                      style={{ borderRadius: '12px' }}
                      onClick={() => setShowHistory(true)}
                    >
                      <History className="w-4 h-4" /> History
                    </button>
                  </div>
 
                  <div className="mb-6 flex flex-col sm:flex-row gap-3">
                    <input value={khataName} onChange={e => setKhataName(e.target.value)} placeholder="Customer Name" className="flex-1 p-2.5 bg-white border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" style={{ borderRadius: '12px' }} />
                    <input value={khataKg} onChange={e => setKhataKg(e.target.value)} placeholder="Gas Qty (Kg)" type="number" className="flex-1 sm:w-32 p-2.5 bg-white border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" style={{ borderRadius: '12px' }} />
                    <button className="px-5 py-3 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md whitespace-nowrap" style={{ borderRadius: '12px' }} onClick={async () => {
                      const res = await addKhataEntry(khataName, khataKg, perKgRate)
                      if (res && res.success) { setToast({ message: res.message, type: 'success' }); setKhataName(''); setKhataKg('') }
                      else setToast({ message: res.message || 'Error', type: 'error' })
                    }}>Add Log Entry</button>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(store.khatabook || {}).length === 0 && <div className="text-sm font-semibold text-slate-500 py-6 text-center">No khata entries recorded yet</div>}
                    {Object.entries(store.khatabook || {}).map(([name, data], idx) => (
                      <div key={idx} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-all">
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-base">{name}</div>
                          <div className="flex flex-wrap gap-4 mt-1 text-xs font-semibold text-slate-500">
                            <span>Total Weight: <span className="text-slate-800">{Number(data.kg || 0).toFixed(2)} kg</span></span>
                            <span>Udhar: <span className="text-red-600">{formatPKR(data.amount || 0)}</span></span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          {addingTo === name ? (
                            <>
                              <input type="number" value={addKgValue} onChange={e => setAddKgValue(e.target.value)} placeholder="Weight (Kg)" className="p-2.5 bg-white border border-slate-300 w-full sm:w-28 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" style={{ borderRadius: '12px' }} />
                              <button className="flex-1 py-2.5 sm:py-1.5 sm:flex-none px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold whitespace-nowrap" style={{ borderRadius: '12px' }} onClick={async () => {
                                const res = await addKhataEntry(name, addKgValue, perKgRate)
                                if (res && res.success) { setToast({ message: res.message, type: 'success' }); setAddingTo(null); setAddKgValue('') }
                                else setToast({ message: res.message || 'Error', type: 'error' })
                              }}>+ Add Weight</button>
                              <button className="flex-1 py-2.5 sm:py-1.5 sm:flex-none px-3 border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs" style={{ borderRadius: '12px' }} onClick={() => { setAddingTo(null); setAddKgValue('') }}>Cancel</button>
                            </>
                          ) : settlingName === name ? (
                            <>
                              <input type="number" value={settleAmount} onChange={e => setSettleAmount(e.target.value)} placeholder="PKR Amount" className="p-2.5 bg-white border border-slate-300 w-full sm:w-32 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" style={{ borderRadius: '12px' }} />
                              <button className="flex-1 py-2.5 sm:py-1.5 sm:flex-none px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1" style={{ borderRadius: '12px' }} onClick={async () => {
                                const res = await settleKhata(name, settleAmount)
                                if (res && res.success) { setToast({ message: res.message, type: 'success' }); setSettlingName(null); setSettleAmount('') }
                                else setToast({ message: res.message || 'Error', type: 'error' })
                              }}><DollarSign className="w-3.5 h-3.5" /> Settle</button>
                              <button className="flex-1 py-2.5 sm:py-1.5 sm:flex-none px-3 border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs" style={{ borderRadius: '12px' }} onClick={() => { setSettlingName(null); setSettleAmount('') }}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button 
                                className="flex-1 py-2.5 sm:py-1.5 sm:flex-none px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5" 
                                style={{ borderRadius: '12px' }} 
                                onClick={() => downloadCustomerPDF(name)}
                              >
                                <Download className="w-3.5 h-3.5" /> Slip
                              </button>
                              <button className="flex-1 py-2.5 sm:py-1.5 sm:flex-none px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold whitespace-nowrap" style={{ borderRadius: '12px' }} onClick={() => { setAddingTo(name); setAddKgValue('') }}>+ Add Kg</button>
                              <button className="flex-1 py-2.5 sm:py-1.5 sm:flex-none px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1" style={{ borderRadius: '12px' }} onClick={() => { setSettlingName(name); setSettleAmount('') }}><DollarSign className="w-3.5 h-3.5" /> Settle Payment</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showHistory && (() => {
                const customerRunningBalances = {}
                const txnRemainingBalances = {}
                const allSortedTxns = [...store.transactions]
                  .filter(t => (t.type === 'khata' || t.type === 'settlement') && t.name)
                  .sort((a, b) => b.created_at.localeCompare(a.created_at))

                allSortedTxns.forEach(t => {
                  const name = t.name
                  if (customerRunningBalances[name] === undefined) {
                    customerRunningBalances[name] = store.khatabook && store.khatabook[name] ? Number(store.khatabook[name].amount || 0) : 0
                  }
                  txnRemainingBalances[t.id] = customerRunningBalances[name]
                  const amt = Number(t.amount || 0)
                  if (t.type === 'settlement') {
                    customerRunningBalances[name] += amt
                  } else if (t.type === 'khata') {
                    customerRunningBalances[name] -= amt
                  }
                })

                return (
                  <div className="modal-overlay" onClick={() => setShowHistory(false)}>
                    <div className="modal p-4 sm:p-6 max-w-3xl w-full" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-5 border-b pb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600" /> 30-Day Settlement History</h3>
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500"
                          onClick={() => setShowHistory(false)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Mobile list cards for settlement history */}
                      <div className="block md:hidden space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                        {(() => {
                          const lastMonth = new Date()
                          lastMonth.setDate(lastMonth.getDate() - 30)
                          const lastMonthStr = lastMonth.toISOString().slice(0, 10)
                          const historyTxns = store.transactions
                            .filter(t => t.type === 'settlement' && t.date >= lastMonthStr)
                            .sort((a, b) => b.date.localeCompare(a.date))
                          
                          if (historyTxns.length === 0) {
                            return <div className="text-center py-8 text-slate-500 text-xs font-semibold">No logs in last 30 days</div>
                          }

                          return historyTxns.map((t, i) => {
                            const remaining = txnRemainingBalances[t.id] ?? 0
                            return (
                              <div key={i} className="bg-slate-50 p-3 border border-slate-200 rounded-xl space-y-1.5 text-xs font-semibold">
                                <div className="flex justify-between text-slate-500 text-[10px]">
                                  <span>{t.date}</span>
                                  <span>Payment Log</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-slate-800">{t.name}</span>
                                  <span className="text-green-600 font-bold">{formatPKR(t.amount || (t.qty && store.perKgRate ? t.qty * store.perKgRate : 0))}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] text-slate-500">
                                  <span>Remaining Balance:</span>
                                  {remaining === 0 ? (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-green-50 text-green-700 border border-green-200">Clear</span>
                                  ) : (
                                    <span className="text-slate-800 font-semibold">{formatPKR(remaining)}</span>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        })()}
                      </div>

                      {/* Desktop table logs */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                              <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                              <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Amount</th>
                              <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(() => {
                              const lastMonth = new Date()
                              lastMonth.setDate(lastMonth.getDate() - 30)
                              const lastMonthStr = lastMonth.toISOString().slice(0, 10)
                              const historyTxns = store.transactions
                                .filter(t => t.type === 'settlement' && t.date >= lastMonthStr)
                                .sort((a, b) => b.date.localeCompare(a.date))
                              
                              if (historyTxns.length === 0) {
                                return <tr><td className="py-6 text-center text-slate-500 text-xs font-semibold" colSpan={4}>No logs in last 30 days</td></tr>
                              }

                              return historyTxns.map((t, i) => {
                                const remaining = txnRemainingBalances[t.id] ?? 0
                                return (
                                  <tr key={i} className="hover:bg-slate-50 transition-all text-xs font-semibold">
                                    <td className="py-3 px-3 text-slate-500">{t.date}</td>
                                    <td className="py-3 px-3 text-slate-900">{t.name}</td>
                                    <td className="py-3 px-3 text-green-600">{formatPKR(t.amount || (t.qty && store.perKgRate ? t.qty * store.perKgRate : 0))}</td>
                                    <td className="py-3 px-3">
                                      {remaining === 0 ? (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-50 text-green-700 border border-green-200">Clear</span>
                                      ) : (
                                        <span className="text-slate-800">{formatPKR(remaining)}</span>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {view === 'reports' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    <div className="p-5 border border-slate-200 bg-indigo-50/40 rounded-xl">
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Today's Revenue</div>
                      <div className="text-2xl font-extrabold text-slate-900">{formatPKR(todaysSalesValue)}</div>
                      <div className="text-[10px] font-semibold text-indigo-500 mt-0.5">{todaysTransactions.length} transactions today</div>
                    </div>
                    <div className="p-5 border border-slate-200 bg-violet-50/40 rounded-xl">
                      <div className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Weekly Aggregate</div>
                      <div className="text-2xl font-extrabold text-slate-900">{formatPKR(weeklySales)}</div>
                      <div className="text-[10px] font-semibold text-violet-500 mt-0.5">Calculated over last 7 days</div>
                    </div>
                    <div className="p-5 border border-slate-200 bg-emerald-50/40 rounded-xl">
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Logs</div>
                      <div className="text-2xl font-extrabold text-slate-900">{store.transactions.length}</div>
                      <div className="text-[10px] font-semibold text-emerald-500 mt-0.5">All-time total transactions</div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-600" /> Weekly Sales Chart</h3>
                    <div className="space-y-3">
                      {(() => {
                        const weekDates = []
                        for (let i = 6; i >= 0; i--) {
                          const d = new Date()
                          d.setDate(d.getDate() - i)
                          weekDates.push(d.toISOString().slice(0, 10))
                        }
                        const salesByDay = weekDates.map(date => {
                          const daySales = store.transactions
                            .filter(t => t.type === 'sale' && t.date === date)
                            .reduce((sum, t) => sum + t.amount, 0)
                          return { date, sales: daySales }
                        })
                        const maxSale = Math.max(...salesByDay.map(d => d.sales), 1)

                        return salesByDay.map((day, i) => {
                          const barWidth = (day.sales / maxSale) * 100
                          const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-12 text-xs font-semibold text-slate-600">{dayName}</div>
                              <div className="flex-1 bg-slate-100 rounded-lg h-9 relative overflow-hidden">
                                {day.sales > 0 ? (
                                  <div
                                    className="bg-indigo-600 h-full rounded-lg transition-all duration-300 flex items-center px-3"
                                    style={{ width: `${barWidth}%`, minWidth: '70px' }}
                                  >
                                    <span className="text-white font-bold text-[10px]">{formatPKR(day.sales)}</span>
                                  </div>
                                ) : (
                                  <div className="h-full w-full flex items-center px-3 text-[10px] font-semibold text-slate-400">PKR 0.00</div>
                                )}
                              </div>
                              <div className="w-20 text-right text-[10px] font-semibold text-slate-400">{day.date}</div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white border border-slate-200 p-5 rounded-xl">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Target className="w-4.5 h-4.5 text-indigo-600" /> Inventory Status</h3>
                      <div className="space-y-4">
                        {Object.entries(store.inventory).map(([type, st]) => {
                          const total = st.filled + st.empty
                          const filledPercent = total > 0 ? (st.filled / total) * 100 : 0
                          return (
                            <div key={type}>
                              <div className="flex justify-between mb-1.5 text-xs font-bold text-slate-700">
                                <span>{type} Cylinders</span>
                                <span>{st.filled} / {total} Filled</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                                <div
                                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${filledPercent}%` }}
                                />
                              </div>
                              <div className="flex justify-between mt-1 text-[10px] font-bold">
                                <span className="text-emerald-600">Filled: {st.filled}</span>
                                <span className="text-amber-600">Empty: {st.empty}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-xl">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4.5 h-4.5 text-indigo-600" /> Transaction Shares</h3>
                      <div className="space-y-4">
                        {['sale', 'shipment', 'refill'].map(type => {
                          const count = store.transactions.filter(t => t.type === type).length
                          const total = store.transactions.length || 1
                          const percent = (count / total) * 100
                          const colors = {
                            sale: { bg: 'bg-indigo-600', text: 'text-indigo-700', light: 'bg-indigo-50 border-indigo-200' },
                            shipment: { bg: 'bg-emerald-600', text: 'text-emerald-700', light: 'bg-emerald-50 border-emerald-200' },
                            refill: { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50 border-amber-200' }
                          }
                          return (
                            <div key={type}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colors[type].light} ${colors[type].text}`}>
                                  {type}
                                </span>
                                <span className="text-xs font-bold text-slate-800">{count} ({percent.toFixed(0)}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                                <div
                                  className={`${colors[type].bg} h-full rounded-full transition-all duration-300`}
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
                  <div className="p-5 border border-slate-200 bg-indigo-50/40 rounded-xl mb-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Weekly Sales Revenue</div>
                      <div className="text-3xl font-extrabold text-slate-900">{formatPKR(weeklySales)}</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-100 text-indigo-600"><BarChart3 className="w-6 h-6" /></div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2"><DollarSign className="w-5.5 h-5.5 text-indigo-600" /> Sales Ledger</h3>
                    
                    {/* Mobile list cards for sales records */}
                    <div className="md:hidden space-y-3">
                      {store.transactions.filter(t => t.type === 'sale').map((s, i) => (
                        <div key={i} className="bg-white p-4 border border-slate-200 rounded-xl space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500">{s.date}</span>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold">Cylinder Sale</span>
                              <button 
                                className="p-1 text-slate-400 hover:text-red-600 transition-all rounded"
                                onClick={async () => {
                                  if (confirm('Are you sure you want to delete this sale and rollback stock?')) {
                                    const res = await deleteSale(s.id, s.note, s.qty)
                                    if (res.success) setToast({ message: res.message, type: 'success' })
                                    else setToast({ message: res.message, type: 'error' })
                                  }
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-800">{s.qty} Cylinder{s.qty > 1 ? 's' : ''}</span>
                            <span className="text-sm font-extrabold text-green-600">{formatPKR(s.amount)}</span>
                          </div>
                          <div className="flex justify-between text-[11px] font-semibold text-slate-500 border-t pt-2">
                            <span>Rate: {formatPKR(s.rate_per_kg || (s.amount && s.qty ? s.amount / (s.qty * 45) : 0))}/kg</span>
                            {s.note && <span>{s.note}</span>}
                          </div>
                        </div>
                      ))}
                      {store.transactions.filter(t => t.type === 'sale').length === 0 && (
                        <div className="text-center py-8 text-slate-500 text-xs font-semibold">No cylinder sales logged yet</div>
                      )}
                    </div>

                    {/* Desktop table logs */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Qty Sold</th>
                            <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                            <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Rate</th>
                            <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks</th>
                            <th className="py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                          {store.transactions.filter(t => t.type === 'sale').map((s, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-all">
                              <td className="py-3 px-3 text-slate-500">{s.date}</td>
                              <td className="py-3 px-3 text-slate-900">{s.qty}</td>
                              <td className="py-3 px-3 text-green-600">{formatPKR(s.amount)}</td>
                              <td className="py-3 px-3 text-slate-600">{formatPKR(s.rate_per_kg || (s.amount && s.qty ? s.amount / (s.qty * 45) : 0))}</td>
                              <td className="py-3 px-3 text-slate-500">{s.note}</td>
                              <td className="py-3 px-3 text-right">
                                <button 
                                  className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                                  style={{ borderRadius: '8px' }}
                                  onClick={async () => {
                                    if (confirm('Are you sure you want to delete this sale and rollback stock?')) {
                                      const res = await deleteSale(s.id, s.note, s.qty)
                                      if (res.success) setToast({ message: res.message, type: 'success' })
                                      else setToast({ message: res.message, type: 'error' })
                                    }
                                  }}
                                  title="Delete Sale"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {store.transactions.filter(t => t.type === 'sale').length === 0 && (
                            <tr><td className="py-8 text-center text-slate-500 font-semibold" colSpan={5}>No cylinder sales logged yet</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {view === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-indigo-600" /> Establishment Profile</h3>
                      <div>
                        {!personalEditing ? (
                          <button
                            className="px-3 py-2 sm:py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                            onClick={() => setPersonalEditing(true)}
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-600" /> Edit Profile
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                              onClick={async () => {
                                if (!localSession || !localSession.name) {
                                  setToast({ message: 'Shop name is required', type: 'error' })
                                  return
                                }
                                
                                const updated = await updateShopDetails({
                                  name: localSession.name,
                                  owner_name: localSession.ownerName || '',
                                  phone: localSession.phone || '',
                                  address: localSession.address || ''
                                })

                                if (updated) {
                                  setPersonalEditing(false)
                                  setToast({ message: 'Personal details saved successfully!', type: 'success' })
                                } else {
                                  setToast({ message: 'Error saving profile details', type: 'error' })
                                }
                              }}
                            >
                              <Save className="w-3.5 h-3.5" /> Save
                            </button>
                            <button
                              className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-all"
                              onClick={() => {
                                setPersonalEditing(false)
                                setLocalSession(session)
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {(!localSession || !localSession.name || !localSession.ownerName || !localSession.phone) && !personalEditing ? (
                      <div className="p-3 mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">Please complete your establishment profile. Click edit to add owner name and phone coordinates.</div>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">Shop Name</label>
                        <input
                          type="text"
                          value={localSession?.name || ''}
                          onChange={(e) => setLocalSession({ ...localSession, name: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 font-semibold"
                          placeholder="Enter shop name"
                          disabled={!personalEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">Owner Name</label>
                        <input
                          type="text"
                          value={localSession?.ownerName || ''}
                          onChange={(e) => setLocalSession({ ...localSession, ownerName: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 font-semibold"
                          placeholder="Enter owner name"
                          disabled={!personalEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">Phone Number</label>
                        <input
                          type="tel"
                          value={localSession?.phone || ''}
                          onChange={(e) => setLocalSession({ ...localSession, phone: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 font-semibold"
                          placeholder="Enter phone number"
                          disabled={!personalEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">Address</label>
                        <input
                          type="text"
                          value={localSession?.address || ''}
                          onChange={(e) => setLocalSession({ ...localSession, address: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 font-semibold"
                          placeholder="Enter address"
                          disabled={!personalEditing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl">
                    <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2"><Package className="w-5 h-5 text-indigo-600" /> Stock Audits</h3>
                    <div className="space-y-4">
                      {Object.entries(store.inventory).map(([type, counts]) => {
                        const total = (counts.filled || 0) + (counts.empty || 0)
                        const isEditing = inventoryEdits[type]?.editing
                        const draftTotal = inventoryEdits[type]?.total ?? total
                        const filledPercent = total > 0 ? ((counts.filled || 0) / total) * 100 : 0
                        return (
                          <div key={type} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50/50 transition-all">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Package className="w-5 h-5 text-indigo-500" /> {type} Cylinders
                              </h4>
                              {!isEditing && (
                                <button
                                  className="px-3 py-2 sm:py-1.5 border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm"
                                  onClick={() => setInventoryEdits({ ...inventoryEdits, [type]: { ...(inventoryEdits[type] || {}), editing: true, total } })}
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-indigo-600" /> Edit Total
                                </button>
                              )}
                            </div>

                            {!isEditing ? (
                              <div className="space-y-3">
                                <div className="text-sm font-semibold text-slate-700">Total Cylinders: <span className="text-slate-900 font-extrabold">{total}</span></div>
                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-xs font-bold">
                                    <span className="text-emerald-600">Filled: {counts.filled || 0}</span>
                                    <span className="text-amber-600">Empty: {counts.empty || 0}</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                                    <div
                                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                      style={{ width: `${filledPercent}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <div className="text-xs font-semibold text-slate-500 mb-3">Enter the new total cylinder count. You'll set the exact filled/empty split next.</div>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Total count</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={draftTotal}
                                      onChange={(e) => setInventoryEdits({ ...inventoryEdits, [type]: { ...(inventoryEdits[type] || {}), editing: true, total: parseInt(e.target.value) || 0 } })}
                                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                                      placeholder="e.g., 30"
                                    />
                                  </div>
                                  <div className="flex gap-2 self-end">
                                    <button
                                      className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
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
                                      Save
                                    </button>
                                    <button
                                      className="px-4 py-2.5 border border-slate-300 hover:bg-white text-slate-600 rounded-lg text-xs font-bold transition-all"
                                      onClick={() => {
                                        const copy = { ...inventoryEdits }
                                        delete copy[type]
                                        setInventoryEdits(copy)
                                      }}
                                    >
                                      Cancel
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
                <div className="modal-overlay" onClick={() => setShowInventoryModal(false)}>
                  <div className="modal p-6 w-full max-w-sm animate-scale-in" onClick={e => e.stopPropagation()}>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Set Distribution</h3>
                    <p className="text-xs text-slate-500 mb-4">Total cylinders: {inventoryModalData.total}</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Filled Cylinders</label>
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
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Empty Cylinders</label>
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
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                        />
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        Sum: {inventoryModalData.filled + inventoryModalData.empty} / {inventoryModalData.total}
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2 justify-end">
                      <button
                        className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-all"
                        onClick={() => setShowInventoryModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        onClick={async () => {
                          if (inventoryModalData.filled + inventoryModalData.empty !== inventoryModalData.total) {
                            setToast({ message: 'Filled + Empty must equal total', type: 'error' })
                            return
                          }
                          const res = await updateInventory(inventoryModalData.type, inventoryModalData.filled, inventoryModalData.empty)
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
                        Save Stock
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )
}
