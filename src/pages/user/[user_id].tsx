import { useSession } from "next-auth/react";
import Head from "next/head";

import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const { user_id } = router.query;
  const userId = user_id as string;

  const { data: userData } = api.user.getUserById.useQuery({ id: userId });
  const { data: repoList } = api.github.fetchRepos.useQuery(
    { linkGithub: userData?.repos ?? "" },
    { enabled: !!userData?.repos }
  );
  console.log(repoList);

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
          </div>
        </div>
      </main>
    </>
  );
}
