import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getFirestore, Firestore } from "firebase/firestore"

// Parse the Firebase config from environment variable
const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}"
)

// Initialize Firebase
let app: FirebaseApp
let db: Firestore

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
} else {
  app = getApps()[0]
  db = getFirestore(app)
}

export { app, db }
