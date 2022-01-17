import { doc, getDoc, writeBatch } from "@firebase/firestore";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";
import SignOutButton from "../components/SignOutButton";
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
    await batch.commit();
  };

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const regx = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (regx.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, `usernames/${username}`);
        const docRes = await getDoc(ref);
        console.log("Firestore read executed!");
        setIsValid(!docRes.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue, checkUsername]);

  return (
    !username && (
      <section>
        <h3></h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button className="btn-green" type="submit" disabled={!isValid}>
            Choose
          </button>
        </form>
      </section>
    )
  );
}
function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
