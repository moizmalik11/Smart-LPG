import React, { useState } from "react"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e){
    e.preventDefault()

    if(username === "admin" && password === "1234"){
      onLogin()
    } else {
      alert("Invalid login credentials")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>LPG Login</h2>

      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />
        <br /><br />
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
