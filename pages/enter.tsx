import { doc, writeBatch } from "@firebase/firestore";
import Image from "next/image";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, firestore, googleAuthProvider, signInWithPopup } from "../lib/firebase";

export default function EnterPage() {
    const { user, username } = useContext(UserContext);
    console.log(`User: ${user}`);
    return (<main>
        {user ?
            !username ? <UsernameForm /> : <SignOutButton />
            :
            <SignInButton />
        }
    </main>)
}
function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    }

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <Image src="/google.png" alt="google logo" width="24" height="24" />
            <span style={{ minWidth: ".5rem" }} />
            Sign in with Google
        </button>
    )
}

function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        const userDoc = doc(firestore, `users/${user.uid}`);
        const usernameDoc = doc(firestore, `usernames/${formValue}`);
        const batch = writeBatch(firestore);
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });
    }

    return null;
}
