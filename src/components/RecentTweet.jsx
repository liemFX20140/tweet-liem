import { api } from "../utils/api";
import { InfinityTweetList } from "~/components/InfinityTweetList";
export function RecentTweets() {
  const tweets = api.tweet.InfFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => {
        lastPage.nextCursor;
      },
    }
  );
  console.log("tweets", tweets.data);
  return (
    <InfinityTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.mappedTweets)}
      hasMore={tweets.hasNextPage}
      fetchData={tweets.fetchNextPage}
    />
  );
}
