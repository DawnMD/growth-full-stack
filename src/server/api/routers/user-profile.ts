import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
    });
  }),
});
