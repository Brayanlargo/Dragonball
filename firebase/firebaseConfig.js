// firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBYjDjIYzNqPgWOkE5lZNUoN8s1pKSqmEA",
  authDomain: "apifirebase-c8a17.firebaseapp.com",
  projectId: "apifirebase-c8a17",
  storageBucket: "apifirebase-c8a17.firebasestorage.app",
  messagingSenderId: "275799949688",
  appId: "1:275799949688:web:78aeee39acbb11eed6888d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };