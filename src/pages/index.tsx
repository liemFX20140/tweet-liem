import { type NextPage } from "next";
import { NewTweetForm } from "~/components/NewTweetForm";
import { RecentTweets } from "~/components/RecentTweet";
import { FollowingTweet } from "~/components/FollowingTweet";
import { useState } from "react";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const [tab, setTab] = useState("Recent");
  const session = useSession();
  const user = session.data?.user;
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white px-4 pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        <div className="flex ">
          <button
            className={`flex-grow hover:bg-gray-200 focus-visible:bg-gray-200 ${
              tab === "Recent" ? "border-b-4 border-b-blue-500 font-bold" : ""
            }`}
            onClick={() => setTab("Recent")}
          >
            Recent
          </button>
          <button
            className={`flex-grow hover:bg-gray-200 focus-visible:bg-gray-200 ${
              tab === "Following"
                ? "border-b-4 border-b-blue-500 font-bold"
                : ""
            }`}
            onClick={() => {
              setTab("Following");
            }}
          >
            Following
          </button>
        </div>
      </header>
      {user ? <NewTweetForm></NewTweetForm> : null}
      {tab === "Recent" ? (
        <RecentTweets></RecentTweets>
      ) : (
        <FollowingTweet></FollowingTweet>
      )}
    </>
  );
};

export default Home;
