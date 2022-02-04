import { TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import SignOutButton from "./SignOutButton";

export function Navbar() {
  const { username, user } = useContext(UserContext);
  const photoURL = user?.photoURL ? user.photoURL : "";
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/" passHref>
            <button className="btn-logo">self:|:made</button>
          </Link>
        </li>
        <li style={{ width: "auto" }}>
          <TextField
            fullWidth
            id="standard-basic"
            label="Search"
            variant="standard"
          />
        </li>
        {username && (
          <>
            <li className="push-left">
              <SignOutButton />
            </li>
            <li>
              <Link href="/admin" passHref>
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`} passHref>
                {photoURL && (
                  <Image
                    src={photoURL}
                    alt="user photo"
                    width="48"
                    height="48"
                  />
                )}
              </Link>
            </li>
          </>
        )}
        {!username && (
          <>
            <li>
              <Link href="/enter" passHref>
                <button className="btn-blue">Log in</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
