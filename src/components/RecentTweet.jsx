import { api } from "../utils/api";
import { InfinityTweetList } from "~/components/InfinityTweetList";
export function RecentTweets() {
  const tweets = api.tweet.InfFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfinityTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.mappedTweets)}
      hasMore={tweets.hasNextPage || false}
      fetchData={tweets.fetchNextPage}
    />
  );
}
