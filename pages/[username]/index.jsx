import { collection, getDocs, limit, orderBy, query as firestoreQuery, where } from "firebase/firestore";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserWithUsername(username);
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = firestoreQuery(collection(userDoc.ref, "posts"), where("published", "==", true), orderBy("createdAt", "desc"), limit(5));
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  } else {
    return {
      notFound: true,
    };
  }
  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}
