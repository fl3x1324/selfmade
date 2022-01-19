import { collection, doc, increment, writeBatch } from "firebase/firestore";
import { useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../lib/firebase";
import Loader from "./Loader";

export default function Heart({ postRef }) {
  const heartRef = doc(collection(postRef, "hearts"), auth.currentUser?.uid);
  const [heartDoc, loading, err] = useDocument(heartRef);
  useEffect(() => {
    console.log(`Loading: ${loading}, heartDoc: ${heartDoc?.exists()}`)
  }, [loading, heartDoc])
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(1) })
    batch.set(heartRef, { uid });
    await batch.commit();
  }

  const removeHeart = async () => {
    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);
    await batch.commit();
  }

  return (
    <>
      <Loader show={loading} />
      {!loading && (
        heartDoc.exists() ? (
          <button className="btn" onClick={removeHeart}>💔 Unheart</button>
        ) : (
          <button className="btn" onClick={addHeart}>❤️ Heart</button>
        )
      )}
    </>
  )
}
