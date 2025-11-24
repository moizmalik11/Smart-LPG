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
  const [session, setSession] = useState(() => initialSession())

  // rename shop with migration: copy old store to new id if needed
  function renameShop(newName){
    if(!newName) return
    const newId = newName.toLowerCase().replace(/\s+/g, '-')
    const oldId = session.id
    const oldKey = `lpg_store_${oldId}`
    const newKey = `lpg_store_${newId}`

    if(newId !== oldId){
      if(!localStorage.getItem(newKey)){
        const data = localStorage.getItem(oldKey)
        if(data) localStorage.setItem(newKey, data)
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

  return (
    <div className="app">
      <Dashboard session={session} renameShop={renameShop} />
    </div>
  )
}
