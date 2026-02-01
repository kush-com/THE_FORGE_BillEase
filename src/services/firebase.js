// src/services/firebase.js
// thin wrapper: initialize firebase if env vars available
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const firebaseEnabled = Boolean(cfg.apiKey && cfg.projectId)

let app = null
export let auth = null
export let db = null
const provider = new GoogleAuthProvider()

export function initFirebase(){
  if (!firebaseEnabled) return
  if (app) return
  app = initializeApp(cfg)
  auth = getAuth(app)
  db = getFirestore(app)
  console.log('Firebase initialized')
}

export async function signInWithGoogle(){
  if (!firebaseEnabled) throw new Error('Firebase not configured')
  return signInWithPopup(auth, provider)
}

export async function signOutGoogle(){
  if (!firebaseEnabled) throw new Error('Firebase not configured')
  return fbSignOut(auth)
}
