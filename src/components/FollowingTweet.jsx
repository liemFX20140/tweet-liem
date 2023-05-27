import { api } from "../utils/api";
import { InfinityTweetList } from "~/components/InfinityTweetList";
export function FollowingTweet() {
  const fetchedTweets = api.tweet.InfFeed.useInfiniteQuery(
    { Following: true },
    {
      getNextPageParam: (lastPage) => {
        lastPage.nextCursor;
      },
    }
  );
  if (fetchedTweets.data == undefined) return null;
  return (
    <div className="flex">
      {fetchedTweets.data?.pages[0]?.mappedTweets.length === 0 ? (
        <h1 className="mx-auto">No Teets</h1>
      ) : (
        <InfinityTweetList
          isError={fetchedTweets.isError}
          tweets={fetchedTweets.data.pages.flatMap((page) => page.mappedTweets)}
          hasMore={fetchedTweets.hasNextPage || false}
          fetchData={fetchedTweets?.fetchNextPage}
        />
      )}
    </div>
  );
}
