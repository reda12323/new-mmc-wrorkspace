import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Web config is public by design; the real protection is the backend check.
const firebaseConfig = {
  apiKey: "AIzaSyAQ3Xq5gUWL8-hIc3z1ZxZuvdco7-O7dgI",
  authDomain: "mmc-company.firebaseapp.com",
  projectId: "mmc-company",
  appId: "1:777561309892:web:3c61c11d32d606590d7f91",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Returns the Firebase user. Errors are thrown on purpose so AuthWeb can handle them.
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export const logout = () => signOut(auth);