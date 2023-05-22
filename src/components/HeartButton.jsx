import { useSession } from "next-auth/react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
export function HeartButton({ likeByMe }) {
  const session = useSession();

  const HeartIcon = likeByMe ? VscHeartFilled : VscHeart;
  return (
    <>
      {session.status !== "authenticated" ? (
        <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
          <HeartIcon></HeartIcon>
        </div>
      ) : (
        <button
          className={`group flex items-center gap-1 self-start transition-colors duration-200 ${
            likeByMe
              ? "text-gray-500"
              : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
          }`}
        >
          <HeartIcon
            className={`transition-colors duration-200 ${
              likeByMe
                ? "fill-red-500"
                : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-gray-500"
            }`}
          ></HeartIcon>
        </button>
      )}
    </>
  );
}
