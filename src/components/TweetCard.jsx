import { useSession } from "next-auth/react";
import Link from "next/link";
import { ProfileImage } from "./ProfileImage";
import { HeartButton } from "~/components/HeartButton";
import { IconHover } from "~/components/IconHover";
import { api } from "~/utils/api";
export function TweetCard({ tweet }) {
  const tweetId = tweet.id;
  const session = useSession();
  const user = session.data?.user;
  const trpcCTX = api.useContext();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: (addedLike) => {
      const updateData = (oldData) => {
        if (oldData == null) return;
        const countModifier = addedLike.addedLike ? 1 : -1;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              mappedTweets: page.mappedTweets.map((tweet) => {
                if (tweet.id === tweetId) {
                  return {
                    ...tweet,
                    likesCount: {
                      likes: tweet.likesCount.likes + countModifier,
                    },
                    likeByMe: addedLike.addedLike,
                  };
                }
                return tweet;
              }),
            };
          }),
        };
      };
      trpcCTX.tweet.InfFeed.setInfiniteData({}, updateData);
      trpcCTX.tweet.InfFeedByUser.setInfiniteData(
        { userId: user?.id },
        updateData
      );
      trpcCTX.tweet.InfFeed.setInfiniteData({ Following: true }, updateData);
    },
  });
  // like feature

  const handleToggleLike = () => {
    toggleLike.mutate({ id: tweet.id });
  };
  const datetimeFormater = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  });
  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user?.id}`}>
        <ProfileImage src={user?.image}></ProfileImage>
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user?.id}`}
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
            <HeartButton
              likeByMe={tweet.likeByMe}
              toggleLike={handleToggleLike}
            ></HeartButton>
          </IconHover>
          <span>{tweet.likesCount.likes}</span>
        </div>
      </div>
    </li>
  );
}
