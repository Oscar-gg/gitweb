import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { UserList } from "~/components/userList";
import { RepoList } from "~/components/repoList";

export default function Home() {
  return (
    <>
      <Head>
        <title>Gitweb - connect with developers</title>
        <meta name="description" content="Gitweb" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Gitweb <span className="text-[hsl(280,100%,70%)]">Zeta</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Wnat others to visit you profile? Log in with you Github Account
                to add into our web.
              </div>
            </div>
            <AuthShowcase />
          </div>
          <div className="flex flex-row items-center gap-2 flex-wrap justify-center">
            <UserList />
            <RepoList user="oscar-gg" />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}!</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
