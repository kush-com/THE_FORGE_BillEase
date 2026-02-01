// src/services/db.js
// Unified data layer: uses Firestore if enabled, otherwise falls back to localStorage.
// Contains minimal methods for demo: getExpenses, addExpense, getBills, addBill, markBillPaid, subscribe (for realtime)

import { firebaseEnabled, db, initFirebase } from './firebase'
import {
  collection, addDoc, onSnapshot, query, where, orderBy, doc, updateDoc, serverTimestamp
} from 'firebase/firestore'

// localStorage keys
const LS_KEY = 'billease:demo:v1'

function readLocal(){
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { expenses: [], bills: [] }
    return JSON.parse(raw)
  } catch { return { expenses: [], bills: [] } }
}
function writeLocal(data){ localStorage.setItem(LS_KEY, JSON.stringify(data)) }

export async function getDataSnapshot(userId){
  // returns { expenses, bills } - local snapshot
  const data = readLocal()
  if (!userId) return data
  // filter by userId in local mode: assume demo user
  return data
}

// Local CRUD
export function addExpenseLocal(expense){
  const s = readLocal()
  s.expenses.unshift(expense)
  writeLocal(s)
}
export function addBillLocal(bill){
  const s = readLocal()
  s.bills.unshift(bill)
  writeLocal(s)
}
export function markBillPaidLocal(billId){
  const s = readLocal()
  const b = s.bills.find(x => x.id === billId)
  if (b) { b.status = 'paid' }
  writeLocal(s)
}

// Firestore fallback helpers (lazy init)
function ensureFirebase(){ if (!firebaseEnabled) throw new Error('Firebase disabled'); if (!db) initFirebase() }

// For demo brevity: Firestore functions are minimal, real app should add queries + security
export async function addExpenseCloud(userId, expense){
  ensureFirebase(); const col = collection(db, 'expenses'); return addDoc(col, { ...expense, userId, createdAt: serverTimestamp() })
}
export async function addBillCloud(userId, bill){
  ensureFirebase(); const col = collection(db, 'bills'); return addDoc(col, { ...bill, userId, createdAt: serverTimestamp() })
}
export async function markBillPaidCloud(billDocId){
  ensureFirebase(); const d = doc(db, 'bills', billDocId); return updateDoc(d, { status: 'paid' })
}

export const mode = firebaseEnabled ? 'cloud' : 'local'

// simple API that the UI will call
export default {
  mode,
  getDataSnapshot,
  addExpenseLocal,
  addExpenseCloud,
  addBillLocal,
  addBillCloud,
  markBillPaidLocal,
  markBillPaidCloud,
}
