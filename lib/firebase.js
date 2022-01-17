import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup as popUpSignIn } from "firebase/auth";
import { collection, getDocs, getFirestore, limit, query, Timestamp, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUbLdhLUfec3FsNHRAHN7-fV4pWFNd4-0",
  authDomain: "nextfire-dc140.firebaseapp.com",
  projectId: "nextfire-dc140",
  storageBucket: "nextfire-dc140.appspot.com",
  messagingSenderId: "915942664414",
  appId: "1:915942664414:web:567e01c7d583f20221ba4f",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const storage = getStorage();
export const firestore = getFirestore();
export const googleAuthProvider = new GoogleAuthProvider();
export const signInWithPopup = popUpSignIn;
export const fromMillis = Timestamp.fromMillis;

export async function getUserWithUsername(username) {
  const usernameQuery = query(collection(firestore, "users"), where("username", "==", username), limit(1));
  return (await getDocs(usernameQuery)).docs[0];
}

export function postToJSON(doc) {
  const data = doc?.data();
  return {
    ...data,
    createdAt: data?.createdAt.toMillis(),
    updatedAt: data?.updatedAt.toMillis(),
    uid: "",
  };
}
