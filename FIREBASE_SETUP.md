# Firebase Setup Guide for BillEase

This guide walks you through setting up Firebase for your BillEase application.

## 🎯 Quick Start Checklist

- [ ] Create Firebase Project
- [ ] Enable Google Authentication
- [ ] Set up Cloud Firestore
- [ ] Configure Firebase in your app
- [ ] Set Firestore Security Rules
- [ ] (Optional) Enable Google Analytics
- [ ] (Optional) Deploy to Firebase Hosting

---

## Step-by-Step Setup

### 1. Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `billease` (or your preferred name)
4. Enable Google Analytics: **Yes** (recommended for tracking usage)
5. Select or create Google Analytics account
6. Click **"Create project"**
7. Wait for project creation (~30 seconds)

---

### 2. Enable Authentication (2 minutes)

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Find **"Google"** in the providers list
5. Click **"Google"**
6. Toggle **"Enable"**
7. Enter support email (your email)
8. Click **"Save"**

**Why Google Auth?**
- ✅ One-click sign-in
- ✅ No password management
- ✅ Secure by default
- ✅ Free tier: unlimited users

---

### 3. Create Cloud Firestore Database (3 minutes)

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Choose location:
   - **For India**: `asia-south1` (Mumbai)
   - **For US**: `us-central1`
   - **For Europe**: `europe-west1`
4. Start mode: **"Start in test mode"** (for development)
   - ⚠️ Test mode allows unrestricted access for 30 days
   - We'll add security rules later!
5. Click **"Enable"**

**Database Structure** (will be created automatically):
```
billease-db/
├── expenses/          # User expenses
│   └── {expenseId}
│       ├── userId
│       ├── amount
│       ├── category
│       ├── description
│       ├── date
│       └── createdAt
│
└── bills/            # User bills
    └── {billId}
        ├── userId
        ├── name
        ├── amount
        ├── dueDate
        ├── recurring
        ├── status
        └── createdAt
```

---

### 4. Get Firebase Configuration (2 minutes)

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Enter app nickname: `BillEase Web`
6. Check **"Also set up Firebase Hosting"** (optional)
7. Click **"Register app"**
8. **Copy the firebaseConfig object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "billease-12345.firebaseapp.com",
  projectId: "billease-12345",
  storageBucket: "billease-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

9. Click **"Continue to console"**

---

### 5. Configure Your App (1 minute)

1. Open `src/services/firebase.js` in your code editor
2. **Replace** the placeholder config with your actual config:

**BEFORE:**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // ...
};
```

**AFTER:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",      // Your actual key
  authDomain: "billease-12345.firebaseapp.com",  // Your actual domain
  projectId: "billease-12345",                    // Your actual project ID
  storageBucket: "billease-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

3. **Save the file**

⚠️ **Security Note**: These credentials are safe to commit to Git. Firebase uses domain restrictions and security rules to protect your data.

---

### 6. Set Firestore Security Rules (5 minutes)

**Important**: Test mode expires in 30 days. Set up proper security rules now!

1. Go to **Firestore Database** → **Rules** tab
2. **Replace everything** with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Expenses Collection
    match /expenses/{expenseId} {
      // Allow read if user is authenticated and owns the expense
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      
      // Allow create if user is authenticated and creating their own expense
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      
      // Allow update/delete if user owns the expense
      allow update, delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
    
    // Bills Collection
    match /bills/{billId} {
      // Allow read if user is authenticated and owns the bill
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      
      // Allow create if user is authenticated and creating their own bill
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      
      // Allow update/delete if user owns the bill
      allow update, delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
  }
}
```

3. Click **"Publish"**

**What these rules do:**
- ✅ Users can only read/write their own data
- ✅ Authentication required for all operations
- ✅ No cross-user data access
- ✅ Secure by default

---

### 7. Test Your Setup (2 minutes)

1. Start your development server:
```bash
npm run dev
```

2. Open `http://localhost:3000`
3. Click **"Continue with Google"**
4. Sign in with your Google account
5. Try adding an expense
6. Check Firebase Console → Firestore Database
7. You should see your expense appear!

---

## 🎨 Optional: Enable Google Analytics

Already enabled if you said "Yes" during project creation!

**View your analytics:**
1. Go to **Analytics** → **Dashboard**
2. See user activity, page views, and more

**Track custom events** (add to your code):
```javascript
import { analytics } from './services/firebase';
import { logEvent } from 'firebase/analytics';

logEvent(analytics, 'expense_added', {
  category: 'food',
  amount: 500
});
```

---

## 🚀 Optional: Deploy to Firebase Hosting

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login:**
```bash
firebase login
```

3. **Initialize hosting:**
```bash
firebase init hosting
```
- Select your project
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub actions: `No` (for now)

4. **Build and deploy:**
```bash
npm run build
firebase deploy
```

5. **Your app is live!** 🎉
```
https://billease-12345.web.app
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Use Firebase security rules
- Keep `firebase.js` config in version control
- Use environment variables for additional secrets
- Enable App Check for production (prevents abuse)

### ❌ DON'T:
- Share your service account key
- Disable authentication
- Use test mode in production
- Store sensitive data in Firestore without encryption

---

## 🐛 Common Issues & Solutions

### Issue 1: "Permission denied" when adding expenses
**Solution**: Check Firestore security rules. Ensure they match the rules above.

### Issue 2: Google Sign-In popup blocked
**Solution**: 
- Allow popups for localhost
- Or use `signInWithRedirect` instead of `signInWithPopup`

### Issue 3: "Firebase: Firebase App named '[DEFAULT]' already exists"
**Solution**: You're initializing Firebase twice. Check for duplicate imports.

### Issue 4: Data not showing up
**Solution**:
1. Check browser console for errors
2. Verify Firebase config is correct
3. Check Firestore rules
4. Ensure user is authenticated

---

## 📊 Monitor Your Usage (Free Tier Limits)

Firebase free plan (Spark) includes:
- ✅ Firestore: 1 GB storage
- ✅ Firestore: 50K reads/day, 20K writes/day
- ✅ Auth: Unlimited users
- ✅ Hosting: 10 GB/month
- ✅ Analytics: Unlimited events

**Check usage:**
Firebase Console → ⚙️ → Usage and billing

---

## 🎓 Advanced: Enable More Google Services

### Cloud Functions (Automated Tasks)
```bash
firebase init functions
```
Example: Send email reminders for upcoming bills

### Cloud Storage (File Uploads)
```bash
firebase init storage
```
Example: Upload receipt photos

### Cloud Messaging (Push Notifications)
Enable in Firebase Console → Cloud Messaging

---

## ✅ Setup Complete!

You should now have:
- ✅ Firebase project created
- ✅ Google Authentication enabled
- ✅ Firestore database configured
- ✅ Security rules in place
- ✅ App connected to Firebase
- ✅ Ready to demo!

**Next Steps:**
1. `npm run dev` - Start development server
2. Sign in with Google
3. Add some expenses and bills
4. Check reports and analytics
5. Deploy to Firebase Hosting (optional)

---

## 🆘 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- Check browser console for error messages
- Review Firestore security rules

**Happy coding! 🚀**
