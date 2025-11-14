import React, { useState } from 'react'
import Dashboard from './components/Dashboard'

function initialSession(){
  const s = localStorage.getItem('lpg_session')
  if(s) return JSON.parse(s)
  const def = { name: 'Masha Allah LPG', id: 'masha-allah-lpg' }
  localStorage.setItem('lpg_session', JSON.stringify(def))
  return def
}

export default function App(){
  const [session] = useState(() => initialSession())

  return (
    <div className="app">
      <Dashboard session={session} />
    </div>
  )
}
