import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Login from './components/Login'

function initialSession() {
  const saved = localStorage.getItem('lpg_session')
  return saved ? JSON.parse(saved) : { name: 'My Shop', id: 'my-shop' }
}

function checkAuthStatus() {
  return localStorage.getItem('lpg_logged_in') === 'true'
}

export default function App() {
  const [session, setSession] = useState(() => initialSession())
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuthStatus())
  const navigate = useNavigate()

  useEffect(() => {
    setIsAuthenticated(checkAuthStatus())
  }, [])

  // rename shop with migration: copy old store to new id if needed
  function renameShop(newName) {
    if (!newName) return
    const newId = newName.toLowerCase().replace(/\s+/g, '-')
    const oldId = session.id
    const oldKey = `lpg_store_${oldId}`
    const newKey = `lpg_store_${newId}`

    if (newId !== oldId) {
      if (!localStorage.getItem(newKey)) {
        const data = localStorage.getItem(oldKey)
        if (data) localStorage.setItem(newKey, data)
        else {
          const initial = { inventory: { '45kg': { filled: 10, empty: 0 } }, transactions: [] }
          localStorage.setItem(newKey, JSON.stringify(initial))
        }
      }
    }

    const ns = { name: newName, id: newId }
    setSession(ns)
    localStorage.setItem('lpg_session', JSON.stringify(ns))
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('lpg_logged_in')
    setIsAuthenticated(false)
    navigate('/login')
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
       
  )
}
