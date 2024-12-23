import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
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

// Función para obtener el id_corp (debe ser implementada según la lógica de la aplicación)
const getIdCorp = (): string => {
  // Aquí se debe implementar la lógica para obtener el id_corp
  return "example_id_corp"; // Reemplazar con la lógica real
};

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const id_corp = getIdCorp();

    // Guardar el id_corp en el documento del usuario en Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      id_corp: id_corp,
    });

    console.log("Usuario autenticado y registrado:", user);
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