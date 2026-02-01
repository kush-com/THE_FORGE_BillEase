// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import dbService from '../services/db'
import { useAuth } from '../context/AuthContext'

export default function Dashboard(){
  const { user } = useAuth()
  const [data, setData] = useState({ expenses: [], bills: [] })

  useEffect(() => {
    // for demo: load from local storage snapshot
    (async ()=> {
      const snap = await dbService.getDataSnapshot(user?.uid)
      setData(snap)
    })()
  }, [user])

  const monthTotal = data.expenses.reduce((s,e)=>s+(e.amount||0),0)
  const upcoming = data.bills.filter(b=>b.status==='upcoming').reduce((s,b)=>s+(b.amount||0),0)

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card primary">
          <div className="label">This Month</div>
          <div className="value">₹{monthTotal.toLocaleString('en-IN')}</div>
        </div>
        <div className="card">
          <div className="label">Upcoming Bills</div>
          <div className="value">₹{upcoming.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <section>
        <h2>Recent</h2>
        <div className="list">
          {data.expenses.slice(0,6).map(e=>(
            <div className="item" key={e.id ?? e.description + e.date}>
              <div>{e.description} • {e.category}</div>
              <div>₹{(e.amount||0).toLocaleString('en-IN')}</div>
            </div>
          ))}
          {data.expenses.length===0 && <p>No expenses yet</p>}
        </div>
      </section>
    </div>
  )
}
