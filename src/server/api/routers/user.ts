import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserIds: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      select: {
        id: true,
      },
    });
  }),

  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
    }),

  getUserPfps: publicProcedure
  .input(z.object({ numOfUsers: z.number(), followersUrl: z.string() }))
  .query(async ({ input, ctx }): Promise<string[]> => {
    try {
      const token = env.GITHUB_API_KEY;
      let response = await fetch(input.followersUrl, {
        headers: {
          'Authorization': `token ${token}`
        }, 
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const responseJson = await response.json();
      const listPfp : string[] = [];
      responseJson.map((result : any) => {
        listPfp.push(result.avatar_url);
      })
      return listPfp;
    } catch (error) {
      console.error("Error fetching pfp info:", error);
      return [""];
    }
  }),
});
