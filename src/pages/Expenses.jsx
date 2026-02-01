// src/pages/Expenses.jsx
import React, { useEffect, useState } from 'react'
import dbService from '../services/db'
import { useAuth } from '../context/AuthContext'

function uid(){ return Math.random().toString(36).slice(2,9) }

export default function Expenses(){
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({ amount:'', category:'food', description:'', date: new Date().toISOString().slice(0,10) })

  useEffect(()=> {
    (async ()=> {
      const snap = await dbService.getDataSnapshot(user?.uid)
      setExpenses(snap.expenses || [])
    })()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const item = { id: uid(), amount: Number(form.amount), category: form.category, description: form.description, date: form.date, type: 'expense' }
    if (dbService.mode === 'cloud') {
      await dbService.addExpenseCloud(user.uid, item)
      // cloud onSnapshot would update UI; for now just reload local snapshot
    } else {
      dbService.addExpenseLocal(item)
    }
    const snap = await dbService.getDataSnapshot(user?.uid)
    setExpenses(snap.expenses)
    setForm({ amount:'', category:'food', description:'', date: new Date().toISOString().slice(0,10) })
  }

  return (
    <div className="page-container">
      <h1>Expenses</h1>
      <form className="mini-form" onSubmit={handleSubmit}>
        <input required placeholder="Amount" type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="shopping">Shopping</option>
          <option value="utilities">Utilities</option>
          <option value="entertainment">Entertainment</option>
          <option value="healthcare">Healthcare</option>
        </select>
        <input required placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
        <button className="btn primary">Add</button>
      </form>

      <div className="list">
        {expenses.map(exp => (
          <div className="item" key={exp.id}>
            <div>{exp.description} • {exp.category}</div>
            <div>₹{exp.amount?.toLocaleString('en-IN')}</div>
          </div>
        ))}
        {expenses.length===0 && <p>No entries</p>}
      </div>
    </div>
  )
}
