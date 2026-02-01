// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { initFirebase, firebaseEnabled, auth, signInWithGoogle, signOutGoogle } from '../services/firebase'

// initialize firebase if enabled
if (firebaseEnabled) initFirebase()

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!firebaseEnabled) return
    // listen for auth state changes
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u ? { uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL } : null)
    })
    return () => unsub()
  }, [])

  const signIn = async () => {
    if (!firebaseEnabled) {
      alert('Firebase not configured. Using local demo mode.')
      return
    }
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error(err)
      alert('Sign-in failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!firebaseEnabled) return alert('Not signed in (local demo).')
    await signOutGoogle()
  }

  const value = { user, loading, signIn, signOut, firebaseEnabled }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
