import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-fimDs9WaP2ovkLOS6xAEVvxnwhGQzK4",
  authDomain: "aimanager-ae568.firebaseapp.com",
  projectId: "aimanager-ae568",
  storageBucket: "aimanager-ae568.firebasestorage.app",
  messagingSenderId: "167367884503",
  appId: "1:167367884503:web:96911724c0401d8bc93a92",
  measurementId: "G-HR1WVP93RJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // Puedes manejar el resultado aquí, como obtener el usuario
    console.log("Usuario autenticado:", result.user);
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Usuario ha cerrado sesión.");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export { db, auth, signInWithGoogle, signOutUser };