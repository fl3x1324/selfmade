import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export function Navbar() {
    const { username, user } = useContext(UserContext);
    return <nav className="navbar">
        <ul>
            <li>
                <Link href="/" passHref>
                    <button className="btn-logo">FEED</button>
                </Link>
            </li>
            {username && (
                <>
                    <li className="push-left">
                        <Link href="/admin" passHref>
                            <button className="btn-blue">Write Posts</button>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${username}`} passHref>
                            <Image src={user?.photoURL} alt="user photo" width="48" height="48" />
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
}
