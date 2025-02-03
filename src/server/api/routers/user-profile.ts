import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { currentUser } from "@clerk/nextjs/server";
// import { TRPCError } from "@trpc/server";

export const userProfileRouter = createTRPCRouter({
  createNewUser: protectedProcedure
    .input(
      z.object({
        weight: z.number(),
        age: z.number(),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]),
        state: z.string(),
        type: z.enum(["STUDENT", "EMPLOYEE", "PARENT"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authUser = await currentUser();

      const user = await ctx.db.user.create({
        data: {
          age: input.age,
          clerkId: ctx.userId,
          firstName: authUser!.firstName!,
          lastName: authUser!.lastName!,
          gender: input.gender,
          state: input.state,
          type: input.type,
        },
      });

      return user;
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
          weight: {
            select: {
              createdAt: true,
              weight: true,
            },
          },
        },
      }),
    ]);

    const processedData = {
      ...userData,
      profilePicture: user?.imageUrl,
      latestHeight: userData?.height[0]?.height ?? 0,
      latestWeight: userData?.weight[0]?.weight ?? 0,
    };

    return processedData;
  }),
  checkUserExists: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
    });

    if (!user) {
      return false;
    }

    return true;
  }),
});
