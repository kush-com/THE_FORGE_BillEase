// src/pages/Reports.jsx
import React, { useEffect, useState } from 'react'
import dbService from '../services/db'
import { useAuth } from '../context/AuthContext'

export default function Reports(){
  const { user } = useAuth()
  const [data, setData] = useState({ expenses: [] })

  useEffect(()=> {
    (async ()=> {
      const snap = await dbService.getDataSnapshot(user?.uid)
      setData({ expenses: snap.expenses || [] })
    })()
  }, [user])

  const total = data.expenses.reduce((s,e)=>s+(e.amount||0),0)
  return (
    <div className="page-container">
      <h1>Reports</h1>
      <div className="report-grid">
        <div className="report-card">
          <div className="label">Total Expenses</div>
          <div className="value">₹{total.toLocaleString('en-IN')}</div>
        </div>
      </div>
      <section>
        <h2>Category breakdown</h2>
        <div className="list small">
          {Object.entries(data.expenses.reduce((acc,e)=>{ acc[e.category]=(acc[e.category]||0)+e.amount; return acc },{})).map(([cat,amt])=>(
            <div className="item" key={cat}>
              <div>{cat}</div>
              <div>₹{amt.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
