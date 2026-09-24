// Firestore connection, loaded from Google's CDN at runtime (no npm install needed).
// If the network or CDN is unavailable, connect() resolves to null and the app stays on localStorage.
// Web config values are public identifiers, not secrets — access is controlled by Firestore rules.

// Flip to false to run fully offline on localStorage only.
export const USE_FIREBASE = true

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2'

const firebaseConfig = {
  apiKey: 'AIzaSyDalZ73YTPGZTC_T-qzstZcUCaLYV_aLQM',
  authDomain: 'nexkitchen-5ff9a.firebaseapp.com',
  projectId: 'nexkitchen-5ff9a',
  storageBucket: 'nexkitchen-5ff9a.firebasestorage.app',
  messagingSenderId: '845436989200',
  appId: '1:845436989200:web:5d29d43c1f419f55513f95',
  measurementId: 'G-ETNYJR9RKX',
}

export async function connect() {
  if (!USE_FIREBASE) return null
  try {
    const [{ initializeApp }, fs] = await Promise.all([
      import(/* @vite-ignore */ `${SDK}/firebase-app.js`),
      import(/* @vite-ignore */ `${SDK}/firebase-firestore.js`),
    ])
    const db = fs.initializeFirestore(initializeApp(firebaseConfig), { ignoreUndefinedProperties: true })
    // All shared canteen state lives in one document so every device sees the same queue.
    return { db, liveRef: fs.doc(db, 'canteen', 'live'), onSnapshot: fs.onSnapshot, runTransaction: fs.runTransaction }
  } catch (err) {
    console.warn('[nexkitchen] Firebase SDK failed to load, running on localStorage:', err.message)
    return null
  }
}
