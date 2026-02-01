// src/pages/Bills.jsx
import React, { useEffect, useState } from 'react'
import dbService from '../services/db'
import { useAuth } from '../context/AuthContext'

function uid(){ return Math.random().toString(36).slice(2,9) }

export default function Bills(){
  const { user } = useAuth()
  const [bills, setBills] = useState([])
  const [form, setForm] = useState({ name:'', amount:'', dueDate:new Date().toISOString().slice(0,10), recurring: 'none' })

  useEffect(()=>{
    (async ()=> {
      const snap = await dbService.getDataSnapshot(user?.uid)
      setBills(snap.bills || [])
    })()
  }, [user])

  const addBill = async (e) => {
    e.preventDefault()
    const b = { id: uid(), name: form.name, amount: Number(form.amount), dueDate: form.dueDate, recurring: form.recurring, status: 'upcoming' }
    if (dbService.mode==='cloud') await dbService.addBillCloud(user.uid, b)
    else dbService.addBillLocal(b)
    const snap = await dbService.getDataSnapshot(user?.uid)
    setBills(snap.bills)
    setForm({ name:'', amount:'', dueDate:new Date().toISOString().slice(0,10), recurring:'none' })
  }

  const markPaid = async (id) => {
    if (dbService.mode==='cloud') await dbService.markBillPaidCloud(id)
    else dbService.markBillPaidLocal(id)
    const snap = await dbService.getDataSnapshot(user?.uid)
    setBills(snap.bills)
  }

  return (
    <div className="page-container">
      <h1>Bills</h1>
      <form className="mini-form" onSubmit={addBill}>
        <input required placeholder="Bill name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input required placeholder="Amount" type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
        <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/>
        <select value={form.recurring} onChange={e=>setForm({...form,recurring:e.target.value})}>
          <option value="none">One-time</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button className="btn primary">Add Bill</button>
      </form>

      <div className="list">
        {bills.map(b => (
          <div className="item bill" key={b.id}>
            <div>
              <div className="bill-name">{b.name} {b.recurring!=='none' && <span className="pill">{b.recurring}</span>}</div>
              <div className="meta">Due {b.dueDate}</div>
            </div>
            <div>
              <div className="amount">₹{b.amount?.toLocaleString('en-IN')}</div>
              {b.status==='upcoming' && <button className="btn" onClick={()=>markPaid(b.id)}>Mark Paid</button>}
            </div>
          </div>
        ))}
        {bills.length===0 && <p>No bills</p>}
      </div>
    </div>
  )
}
