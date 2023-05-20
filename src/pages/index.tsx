import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { NewTweetForm } from "~/components/NewTweetForm";
import { api } from "~/utils/api";

const Home: NextPage = () => (
  <>
    <header className="sticky top-0 z-10 border-b bg-white px-4 pt-2">
      <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
    </header>
    <NewTweetForm></NewTweetForm>
  </>
);

export default Home;
