// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup as popUpSignIn } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
