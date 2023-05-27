import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const TweetRouter = createTRPCRouter({
  InfFeedByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor, userId }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const whereClause = {
        userId,
      };
      const tweets = await ctx.prisma.tweet.findMany({
        where: whereClause,
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
          createdAt: tweet.createdAt,
          likesCount: tweet._count,
          user: tweet.user,
          likeByMe: tweet.likes ? tweet.likes.length > 0 : false,
        };
      });
      return { mappedTweets, nextCursor };
    }),
  InfFeed: publicProcedure
    .input(
      z.object({
        Following: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({ input: { limit = 10, cursor, Following = false }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        const whereClause =
          !Following || !currentUserId
            ? undefined
            : { user: { followers: { some: { id: currentUserId } } } };
        const tweets = await ctx.prisma.tweet.findMany({
          where: whereClause,
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
            createdAt: tweet.createdAt,
            likesCount: tweet._count,
            user: tweet.user,
            likeByMe: tweet.likes ? tweet.likes.length > 0 : false,
          };
        });
        return { mappedTweets, nextCursor };
      }
    ),
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.name === undefined) return;
      const tweet = await ctx.prisma.tweet.create({
        data: {
          content: input.content,
          userId: ctx.session.user.id,
        },
      });
      return tweet;
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { tweetId: id, userId: ctx.session.user.id };
      const existLike = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data },
      });
      if (existLike == null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({
          where: {
            userId_tweetId: data,
          },
        });
        return { addedLike: false };
      }
    }),
});
