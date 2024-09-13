import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

interface FollowersResultType {
  login: string,
  id: number,
  node_id: string,
  avatar_url: string,
  gravatar_id: string,
  url: string,
  html_url: string,
  followers_url: string,
  following_url: string,
  gists_url: string,
  starred_url: string,
  subscriptions_url: string,
  organizations_url: string,
  repos_url: string,
  events_url: string,
  received_events_url: string,
  type: string,
  site_admin: boolean
}


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
  .query(async ({ input }): Promise<string[]> => {
    try {
      const token = env.GITHUB_API_KEY;
      const response = await fetch(input.followersUrl, {
        headers: {
          'Authorization': `token ${token}`
        }, 
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const responseJson = await response.json() as FollowersResultType[];
      const listPfp : string[] = [];
      responseJson.map((result : FollowersResultType) => {
        listPfp.push(result.avatar_url);
      })
      return listPfp;
    } catch (error) {
      console.error("Error fetching pfp info:", error);
      return [""];
    }
  }
  ),
  deleteUserById: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.delete({
      where: { id: ctx.session.user.id },
    });
  }),
});
