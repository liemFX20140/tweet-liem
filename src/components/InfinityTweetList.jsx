import InfiniteScroll from "react-infinite-scroll-component";
import { TweetCard } from "~/components/TweetCard";
export function InfinityTweetList({ tweets, hasMore, fetchData }) {
  return (
    <>
      {tweets == null ? (
        <p>loading</p>
      ) : (
        <ul>
          <InfiniteScroll
            dataLength={tweets.length}
            children={tweets.map((tweet) => {
              return <TweetCard key={tweet.id} tweet={tweet}></TweetCard>;
            })}
            next={fetchData}
            hasMore={hasMore}
            loader={"Loading..."}
          ></InfiniteScroll>
        </ul>
      )}
    </>
  );
}
