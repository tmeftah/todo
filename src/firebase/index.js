import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDEF1TKHti0Y5FNtMZSReeikRjdO4Exo4A',

  authDomain: 'todo-app-67b0e.firebaseapp.com',

  projectId: 'todo-app-67b0e',

  storageBucket: 'todo-app-67b0e.appspot.com',

  messagingSenderId: '84350749848',

  appId: '1:84350749848:web:9c2c98112647021c8894ed'
}

// Initialize Firebase

const app = initializeApp(firebaseConfig)
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

//initialize firebase auth
const auth = getAuth()
setPersistence(auth, browserLocalPersistence)

export { db, auth }
