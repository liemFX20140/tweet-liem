import InfiniteScroll from "react-infinite-scroll-component";
import { TweetCard } from "~/components/TweetCard";
import { LoadingSpinner } from "~/components/LoadingSpinner";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likesCount: { likes: number };
  user: { image: string | null; id: string; name: string | null };
  likeByMe: boolean;
};

type Props = {
  tweets: Tweet[];
  hasMore: boolean | undefined;
  fetchData: () => Promise<unknown>;
  isError: boolean;
};

export function InfinityTweetList({
  tweets,
  hasMore,
  fetchData,
  isError,
}: Props) {
  if (isError) return <h1>Error...</h1>;
  return (
    <>
      {tweets == null ? (
        <LoadingSpinner></LoadingSpinner>
      ) : (
        <ul>
          <InfiniteScroll
            dataLength={tweets.length}
            next={fetchData}
            hasMore={hasMore || false}
            loader={<LoadingSpinner></LoadingSpinner>}
          >
            {tweets.map((tweet: { id: string }) => {
              return <TweetCard key={tweet.id} tweet={tweet}></TweetCard>;
            })}
          </InfiniteScroll>
        </ul>
      )}
    </>
  );
}
