import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { VscHome, VscAccount, VscSignOut, VscSignIn } from "react-icons/vsc";
import { IconHover } from "./IconHover";

const SideNav = (props) => {
  const session = useSession();
  const data = session.data;
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href={"/"}>
            <IconHover>
              <span className="flex items-center gap-4">
                <VscHome className="h-8 w-8"></VscHome>
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHover>
          </Link>
        </li>
        {user && (
          <li>
            <Link href={`/profiles/${user?.id}`}>
              <IconHover>
                <span className="flex items-center gap-4">
                  <VscAccount className="h-8 w-8"></VscAccount>
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </IconHover>
            </Link>
          </li>
        )}
        {data !== null ? (
          <li>
            <button onClick={() => void signOut()}>
              <IconHover red={true}>
                <span className="flex items-center gap-4">
                  <VscSignOut className="h-8 w-8"></VscSignOut>
                  <span className="hidden text-lg md:inline">Sign Out</span>
                </span>
              </IconHover>
            </button>
          </li>
        ) : (
          <li>
            <button onClick={() => void signIn()}>
              <IconHover>
                <span className="flex items-center gap-4">
                  <VscSignIn className="h-8 w-8"></VscSignIn>
                  <span className="hidden text-lg md:inline">Sign In</span>
                </span>
              </IconHover>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};
export default SideNav;
