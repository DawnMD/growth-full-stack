import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { currentUser } from "@clerk/nextjs/server";

export const userProfileRouter = createTRPCRouter({
  createNewUser: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        weight: z.number(),
        age: z.number(),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.create({
        data: {
          age: input.age,
          clerkId: ctx.userId,
          firstName: input.firstName,
          lastName: input.lastName,
          weight: input.weight,
          gender: input.gender,
        },
      });
    }),
  getUserProfileData: protectedProcedure.query(async ({ ctx }) => {
    const [user, userData] = await Promise.all([
      currentUser(),
      ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
        include: {
          height: {
            select: {
              createdAt: true,
              height: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      }),
    ]);

    const processedData = {
      ...userData,
      profilePicture: user?.imageUrl,
      latestHeight: userData?.height[0]?.height ?? 0,
    };

    return processedData;
  }),
});
