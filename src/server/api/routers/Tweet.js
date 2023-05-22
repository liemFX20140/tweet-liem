import { count } from "console";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const TweetRouter = createTRPCRouter({
  InfFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const tweets = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { id_createdAt: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          user: {
            select: { name: true, id: true, image: true },
          },
        },
      });
      let nextCursor;
      if (tweets.length > limit) {
        const nextItem = tweets.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }
      const mappedTweets = tweets.map((tweet) => {
        return {
          id: tweet.id,
          content: tweet.content,
          createAt: tweet.createAt,
          likesCount: tweet._count,
          user: tweet.user,
          likeByMe: tweet.likes.length > 0,
        };
      });
      return { mappedTweets, nextCursor };
    }),
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const tweet = await ctx.prisma.tweet.create({
        data: {
          content: input.content,
          userId: ctx.session.user.id,
        },
      });
      return tweet;
    }),
});
