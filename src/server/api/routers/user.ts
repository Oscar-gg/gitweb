import { z } from "zod";
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
});
