import InfiniteScroll from "react-infinite-scroll-component";
import { TweetCard } from "~/components/TweetCard";
import { LoadingSpinner } from "~/components/LoadingSpinner";
export function InfinityTweetList({ tweets, hasMore, fetchData }) {
  return (
    <>
      {tweets == null ? (
        <LoadingSpinner></LoadingSpinner>
      ) : (
        <ul>
          <InfiniteScroll
            dataLength={tweets.length}
            children={tweets.map((tweet) => {
              return <TweetCard key={tweet.id} tweet={tweet}></TweetCard>;
            })}
            next={fetchData}
            hasMore={hasMore}
            loader={<LoadingSpinner></LoadingSpinner>}
          ></InfiniteScroll>
        </ul>
      )}
    </>
  );
}
