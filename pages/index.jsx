import { collectionGroup, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useState } from "react";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";

const LIMIT = 15;

export async function getServerSideProps(_) {
  const postsQuery = query(collectionGroup(firestore, "posts"), where("published", "==", true), orderBy("createdAt", "desc"), limit(LIMIT));
  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  return {
    props: { posts },
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === "number" ? fromMillis(last.createdAt) : last.createdAt;

    const postsQuery = query(collectionGroup(firestore, "posts"), where("published", "==", true), orderBy("updatedAt", "desc"), startAfter(cursor), limit(LIMIT));
    const newPosts = (await getDocs(postsQuery)).docs.map(doc => doc.data());
    setPosts(posts.concat(newPosts));
    setLoading(false);
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }
  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
      <Loader show={loading} />
      {postsEnd && "You've reached the end!"}
    </main>
  );
}
