import Image from "next/image";

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <div className="card-img-center">
        <Image alt="profile pic" src={user.photoURL || "/hacker.png"} className="card-img-center" width={150} height={150} />
      </div>
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || "Anonymous User"}</h1>
    </div>
  )
}
