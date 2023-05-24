import { api } from "../utils/api";
import { InfinityTweetList } from "~/components/InfinityTweetList";
export function FollowingTweet() {
  const tweets = api.tweet.InfFeed.useInfiniteQuery(
    { Following: true },
    {
      getNextPageParam: (lastPage) => {
        lastPage.nextCursor;
      },
    }
  );
  console.log();
  return (
    <div className="flex">
      {tweets.data?.pages[0]?.mappedTweets.length === 0 ? (
        <h1 className="mx-auto">No Teets</h1>
      ) : (
        <InfinityTweetList
          tweets={tweets.data?.pages.flatMap((page) => page.mappedTweets)}
          hasMore={tweets.hasNextPage}
          fetchData={tweets.fetchNextPage}
        />
      )}
    </div>
  );
}
