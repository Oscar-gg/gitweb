import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface GithubReposType {
  id: number;
  commits_url: string;
  name: string;
}

export const githubRouter = createTRPCRouter({
  fetchRepos: publicProcedure
    .input(z.object({ linkGithub: z.string() }))
    .query(async ({ input }) => {
      try {
        const token = env.GITHUB_API_KEY;
        const response = await fetch(input.linkGithub, {
          headers: {
            Authorization: `token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const responseJson = (await response.json()) as GithubReposType;
        const listPfp: GithubReposType[] = [];
        if (Array.isArray(responseJson)) {
          responseJson.map((result: GithubReposType) => {
            listPfp.push({ id: result.id, name: result.name, commits_url: result.commits_url });
          });
        } else {
          console.error("responseJson is not an array");
        }
        return listPfp;
      } catch (error) {
        console.error("Error fetching github data:", error);
        return "";
      }
    }),
});
