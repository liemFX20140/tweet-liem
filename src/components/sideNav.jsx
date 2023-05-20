import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const SideNav = (props) => {
  const session = useSession();
  const user = session.data?.user;

  console.log(session);
  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        {user && (
          <li>
            <Link href={`/profiles/${user?.id}`}>Profile</Link>
          </li>
        )}
        {user !== null ? (
          <li>
            <button onClick={() => void signOut()}>Log Out</button>
          </li>
        ) : (
          <li>
            <button onClick={() => void signIn()}>Log In</button>
          </li>
        )}
      </ul>
    </nav>
  );
};
export default SideNav;
