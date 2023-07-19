import { z } from "zod";
import { protectedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

type option = {
  region: string;
  bucket: string;
  key: string;
};

export const PhotoRouter = createTRPCRouter({
  getPresigndUrl: protectedProcedure.mutation(async ({ input }) => {
    const REGION = env.AWS_REGION;
    const BUCKET = "tweet-liem";

    const KEY = uuidv4();
    const s3 = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_KEY,
      },
    });
    const command = new PutObjectCommand({ Bucket: BUCKET, Key: KEY });
    const url = await getSignedUrl(s3, command);

    return { key: KEY, url: url };
  }),
  shareUrl: publicProcedure.input(z.string()).mutation(async ({ input }) => {}),
});
