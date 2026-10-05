import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDmZg7YN9OOFz0Sod9vQG9LdsslcoUm4Zs",
  authDomain: "oopu-26b79.firebaseapp.com",
  projectId: "oopu-26b79",
  storageBucket: "oopu-26b79.firebasestorage.app",
  messagingSenderId: "207637243695",
  appId: "1:207637243695:web:72f8399e7ae210753b63da",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)