import { collection, collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import Link from 'next/link';
import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import Heart from "../../components/HeartButton";
import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import styles from "../../styles/Post.module.css";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);
  let path;
  let post;
  if (userDoc) {
    const postDoc = await getDoc(doc(collection(userDoc.ref, "posts"), slug));
    if (!postDoc || !postDoc.ref) {
      return notFound();
    }
    post = postToJSON(postDoc);
    path = postDoc.ref.path;
  } else {
    return notFound();
  }
  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = (await getDocs(collectionGroup(firestore, "posts")));
  const paths = snapshot.docs.map(doc => {
    const { slug, username } = doc.data();
    return {
      params: { slug, username },
    };
  })
  return {
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);
  const post = realtimePost || props.post;
  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <div>
          <strong>{post.heartCount || 0} ❤️</strong>
          <AuthCheck fallback={(<Link href="/enter" passHref><button className="btn-primary">❤️ Sign In</button></Link>)}>
            <Heart postRef={postRef} />
          </AuthCheck>
        </div>
      </aside>
    </main>
  )
}

function notFound() {
  return {
    notFound: true,
  };
}
