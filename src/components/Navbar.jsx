// src/components/Navbar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const { user, signIn, signOut, firebaseEnabled } = useAuth()
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="logo">
          <div className="logo-icon">₹</div>
          <div className="logo-text">BillEase</div>
        </div>
        <div className="nav-links">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/expenses" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Expenses</NavLink>
          <NavLink to="/bills" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Bills</NavLink>
          <NavLink to="/reports" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Reports</NavLink>
        </div>
        <div className="nav-actions">
          {firebaseEnabled ? (
            user ? (
              <div className="user-block">
                <img src={user.photoURL} alt={user.displayName} className="avatar"/>
                <button onClick={signOut} className="btn small">Sign out</button>
              </div>
            ) : (
              <button onClick={signIn} className="btn primary small">Sign in with Google</button>
            )
          ) : (
            <span className="badge">Local demo</span>
          )}
        </div>
      </div>
    </nav>
  )
}
