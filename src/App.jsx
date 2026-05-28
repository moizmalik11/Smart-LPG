import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import { supabase } from './lib/supabaseClient'

export default function App() {
  const [session, setSession] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // 1. Check initial active session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      handleAuthChange(activeSession)
    })

    // 2. Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      handleAuthChange(activeSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthChange = async (activeSession) => {
    if (activeSession) {
      try {
        // Fetch custom shop details from shops profile table
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('id', activeSession.user.id)
          .single()

        if (data) {
          setSession({
            name: data.name,
            id: data.id,
            ownerName: data.owner_name,
            phone: data.phone,
            address: data.address
          })
        } else {
          // Fallback in case table has no profile record yet
          setSession({
            name: activeSession.user.email.split('@')[0],
            id: activeSession.user.id
          })
        }
        setIsAuthenticated(true)
      } catch (err) {
        console.error('Error loading shop profile:', err)
        setIsAuthenticated(true)
      }
    } else {
      setIsAuthenticated(false)
      setSession(null)
    }
    setLoading(false)
  }

  // rename shop directly updates Supabase shops profile database table
  async function renameShop(newName) {
    if (!newName || !session) return
    const { error } = await supabase
      .from('shops')
      .update({ name: newName })
      .eq('id', session.id)

    if (!error) {
      const updated = { ...session, name: newName }
      setSession(updated)
      return updated
    }
  }

  const handleLoginSuccess = () => {
    navigate('/dashboard')
  }

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setSession(null)
    setLoading(false)
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs font-semibold text-slate-500">Loading your profile...</span>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated && session ? (
            <div className="app">
              <Dashboard session={session} renameShop={renameShop} onLogout={handleLogout} />
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}
