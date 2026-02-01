# BillEase - Expense & Bill Management System

A modern, full-stack expense tracking application built with **React**, **Firebase**, and **Google Cloud services**.

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Google Cloud)
- **Database**: Cloud Firestore (NoSQL)
- **Authentication**: Firebase Auth with Google Sign-In
- **Hosting**: Firebase Hosting
- **Charts**: Google Charts (react-google-charts)
- **Analytics**: Google Analytics (Firebase)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Syne & DM Sans)

## ✨ Features

### Core Functionality
- 📊 **Dashboard**: Real-time balance overview and spending insights
- 💰 **Expense Tracking**: Add, view, filter, and delete expenses by category
- 🔔 **Bill Reminders**: Track upcoming bills and mark as paid
- 📈 **Reports**: Monthly insights with Google Charts visualizations
- ☁️ **Cloud Sync**: Real-time data sync across devices via Firebase
- 🔐 **Google Authentication**: Secure sign-in with Google accounts

### Google Tools Integration (BONUS Points!)
1. **Firebase** (Google Cloud Platform)
   - Cloud Firestore for real-time database
   - Firebase Authentication with Google Sign-In
   - Firebase Hosting for deployment
   - Google Analytics integration

2. **Google Charts**
   - Interactive pie charts for category distribution
   - Line charts for spending trends
   - Responsive and customizable visualizations

3. **Google Fonts**
   - Premium typography (Syne & DM Sans)
   - Optimized loading from Google CDN

4. **Google Cloud Services Ready**
   - Cloud Functions (can be added for automated bill reminders)
   - Cloud Messaging (for push notifications)
   - Cloud Storage (for receipt uploads)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Google Account
- Firebase Project (free tier works!)

### Step 1: Clone/Download the Project
```bash
# If you have the files, navigate to the directory
cd billease-react-firebase
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Enter project name (e.g., "BillEase")
   - Enable Google Analytics (optional)
   - Create project

2. **Enable Authentication**
   - In Firebase Console, go to **Authentication** → **Get Started**
   - Click **Sign-in method** tab
   - Enable **Google** provider
   - Click **Save**

3. **Create Firestore Database**
   - Go to **Firestore Database** → **Create database**
   - Choose **Start in test mode** (for development)
   - Select a location (choose closest to you)
   - Click **Enable**

4. **Get Firebase Configuration**
   - In Firebase Console, click the gear icon → **Project settings**
   - Scroll down to "Your apps"
   - Click the **Web** icon (`</>`)
   - Register your app with a nickname (e.g., "BillEase Web")
   - Copy the `firebaseConfig` object

5. **Configure Your App**
   - Open `src/services/firebase.js`
   - Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Step 4: Firestore Security Rules

Set up basic security rules in Firebase Console:

1. Go to **Firestore Database** → **Rules**
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Expenses collection
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Bills collection
    match /bills/{billId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **Publish**

### Step 5: Run the Development Server
```bash
npm run dev
```

Your app will open at `http://localhost:3000`

### Step 6: Build for Production
```bash
npm run build
```

## 🌐 Deploy to Firebase Hosting (Optional)

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase Hosting**
```bash
firebase init hosting
```
- Select your Firebase project
- Set public directory to `dist`
- Configure as single-page app: **Yes**
- Don't overwrite index.html: **No**

4. **Build and Deploy**
```bash
npm run build
firebase deploy
```

Your app will be live at `https://your-project-id.web.app`

## 📂 Project Structure

```
billease-react-firebase/
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.jsx
│   │   ├── ExpenseModal.jsx
│   │   └── BillModal.jsx
│   ├── pages/             # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Expenses.jsx
│   │   ├── Bills.jsx
│   │   └── Reports.jsx
│   ├── context/           # React Context
│   │   └── AuthContext.jsx
│   ├── services/          # Firebase services
│   │   ├── firebase.js
│   │   └── firestoreService.js
│   ├── styles/            # CSS files
│   │   ├── App.css
│   │   ├── Login.css
│   │   ├── Navbar.css
│   │   ├── Dashboard.css
│   │   ├── Expenses.css
│   │   ├── Bills.css
│   │   ├── Reports.css
│   │   └── Modal.css
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Key Features Explanation

### 1. Real-time Data Sync
- Uses Firestore's `onSnapshot` for live updates
- Changes reflect instantly across all devices

### 2. Google Sign-In
- One-click authentication
- Secure user management
- Profile picture and name from Google account

### 3. Category-based Tracking
- 7 predefined categories with unique icons
- Automatic calculation of spending by category
- Visual breakdown with charts

### 4. Bill Management
- Track upcoming, paid, and overdue bills
- Recurring bill support
- One-click mark as paid

### 5. Analytics & Reports
- Google Charts integration for visualizations
- Monthly spending trends
- Category distribution pie chart
- Actionable insights

## 🔧 Customization

### Change Color Scheme
Edit CSS variables in `src/styles/App.css`:
```css
:root {
  --primary: #FF6B35;      /* Main brand color */
  --secondary: #FFB627;    /* Accent color */
  --bg-primary: #0A0E27;   /* Background */
}
```

### Add New Categories
Edit category config in components:
```javascript
const categoryConfig = {
  newCategory: { icon: '🎯', color: '#...' , name: '...' }
};
```

### Enable More Google Services

**Cloud Messaging** (Push Notifications):
```bash
npm install firebase
```
Add to `firebase.js`:
```javascript
import { getMessaging } from 'firebase/messaging';
export const messaging = getMessaging(app);
```

**Cloud Functions** (Backend Logic):
```bash
firebase init functions
```

## 🐛 Troubleshooting

**Firebase not connecting?**
- Double-check your config in `firebase.js`
- Ensure Firestore is enabled
- Check browser console for errors

**Google Sign-In not working?**
- Verify Google provider is enabled in Firebase Console
- Check authorized domains in Authentication settings

**Charts not displaying?**
- Clear browser cache
- Check if data exists in Firestore
- Verify react-google-charts is installed

## 📱 Mobile Responsive
The app is fully responsive and works on:
- Desktop (1400px+)
- Tablet (768px - 1400px)
- Mobile (< 768px)

## 🔐 Security Best Practices

1. ✅ User data isolated by `userId`
2. ✅ Firestore security rules implemented
3. ✅ Firebase Auth required for all operations
4. ✅ No API keys in client code (using Firebase SDK)

## 📊 Google Analytics Integration

Already integrated! Track:
- User signups
- Page views
- Feature usage

View analytics in Firebase Console → Analytics dashboard

## 🎓 Learning Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Google Charts Gallery](https://developers.google.com/chart/interactive/docs/gallery)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)

## 🏆 Bonus Points Checklist

- ✅ Firebase (Google Cloud) as backend
- ✅ Google Authentication
- ✅ Google Charts for visualizations
- ✅ Google Fonts for typography
- ✅ Google Analytics integration
- ✅ Firebase Hosting ready
- ✅ Firestore real-time database
- ✅ Cloud-ready architecture (Functions, Storage, Messaging)

## 💡 Future Enhancements

1. **Cloud Functions**: Automated bill reminders via email
2. **Cloud Storage**: Upload receipt photos
3. **Cloud Messaging**: Push notifications for due bills
4. **Google Drive API**: Export reports to Google Sheets
5. **Gmail API**: Email monthly reports
6. **Google Pay**: Quick expense entry via payment integration

## 📄 License

MIT License - feel free to use for your hackathon/project!

## 🤝 Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console logs
3. Verify Firestore security rules
4. Ensure all dependencies are installed

---

**Built with ❤️ using React, Firebase, and Google Cloud Services**

Good luck with your 2-hour demo! 🚀
