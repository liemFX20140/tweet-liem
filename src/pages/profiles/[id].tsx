import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import ErrorPage from "next/error";
import { ssgHelper } from "../../server/api/ssgHelper";
import { api } from "~/utils/api";
import Head from "next/head";
import Link from "next/link";
import { IconHover } from "~/components/IconHover";
import { VscArrowLeft } from "react-icons/vsc";
import { ProfileImage } from "~/components/ProfileImage";
import { InfinityTweetList } from "~/components/InfinityTweetList";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { FollowingButton } from "~/components/FollowingButton";
const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profiles.getById.useQuery({ id });
  if (profile == null) {
    return <ErrorPage statusCode={404}></ErrorPage>;
  }
  const tweets = api.tweet.InfFeedByUser.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  // toggle follow
  const trpc = api.useContext();
  const toggleFollow = api.profiles.toggleFollow.useMutation({
    onSuccess: ({ addFollow }) => {
      trpc.profiles.getById.setData({ id }, (oldData) => {
        if (oldData == null) return;
        const modifierFollower = addFollow ? 1 : -1;
        return {
          ...oldData,
          isFollowing: addFollow,
          followersCount: oldData.followersCount + modifierFollower,
        };
      });
    },
  });

  // loadding
  if (profile == null && !tweets.isLoading) {
    return <ErrorPage statusCode={404}></ErrorPage>;
  }
  if (tweets.isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  return (
    <>
      <Head>
        <title>{`Twitter - ${profile.name || ""}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href={".."} className="mr-2">
          <IconHover>
            <VscArrowLeft className="h-6 w-6"></VscArrowLeft>
          </IconHover>
        </Link>
        <ProfileImage
          src={profile.image}
          className="flex-shrink-0"
        ></ProfileImage>
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile?.name}</h1>
          <div className="text-gray-500">
            {profile && profile?.tweetsCount > 1
              ? `${profile.tweetsCount} Tweets`
              : `${profile.tweetsCount} Tweet`}
            <span className="ml-2">{profile.followingCount} Following</span>
            <span className="ml-2">
              {profile && profile?.followersCount > 1
                ? `${profile.followersCount} Followers`
                : `${profile.followersCount} Follower`}
            </span>
            {"      "}
            <FollowingButton
              userId={id}
              isFollowing={profile?.isFollowing || false}
              onClickButton={() => toggleFollow.mutate({ userId: id })}
            ></FollowingButton>
          </div>
        </div>
      </header>
      <main>
        <InfinityTweetList
          tweets={tweets.data?.pages.flatMap((page) => page.mappedTweets)}
          hasMore={tweets.hasNextPage || false}
          fetchData={tweets.fetchNextPage}
        ></InfinityTweetList>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;
  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const ssg = ssgHelper();
  await ssg.profiles.getById.prefetch({ id });
  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default ProfilePage;
