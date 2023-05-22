import { useSession } from "next-auth/react";
import Link from "next/link";
import { ProfileImage } from "./ProfileImage";
import { HeartButton } from "~/components/HeartButton";
import { IconHover } from "~/components/IconHover";
export function TweetCard({ tweet }) {
  console.log(tweet.likesCount.likes);
  const datetimeFormater = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  });
  const session = useSession();
  const user = session.data?.user;
  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user?.image}></ProfileImage>
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500"></span>
          <span className="text-gray-500">
            {" "}
            {datetimeFormater.format(tweet.createAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{tweet.content}</p>
        <div className="flex items-center">
          <IconHover red={true}>
            <HeartButton likeByMe={tweet.likeByMe}></HeartButton>
          </IconHover>
          <span>{tweet.likesCount.likes}</span>
        </div>
      </div>
    </li>
  );
}
