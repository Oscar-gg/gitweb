import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const githubRouter = createTRPCRouter({
  fetchRepos: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = await fetch("https://api.github.com/users/Oscar-gg/repos", {
          method: 'GET',
          body: input.text,
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const jsonResponse = await response.text();
        return jsonResponse;
      } catch (error) {
        console.error("Error fetching github data:", error);
        return "";
      }
    }),
});