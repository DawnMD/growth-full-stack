import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "node_modules/zod/lib";

export const studentRouter = createTRPCRouter({
  createStudent: protectedProcedure
    .input(
      z.object({
        age: z.number(),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]),
        state: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { age, gender, state } = input;

      const user = await currentUser();

      return await ctx.db.student.create({
        data: {
          age,
          gender,
          state,
          clerkId: ctx.userId,
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
        },
      });
    }),
  getStudentProfile: protectedProcedure.query(async ({ ctx }) => {
    const [user, userData] = await Promise.all([
      currentUser(),
      ctx.db.student.findUnique({
        where: { clerkId: ctx.userId },
        include: {
          heights: {
            select: {
              createdAt: true,
              height: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          weights: {
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
      latestHeight: userData?.heights[0]?.height ?? 0,
      latestWeight: userData?.weights[0]?.weight ?? 0,
    };

    return processedData;
  }),
  addHealthMetrics: protectedProcedure
    .input(
      z.object({
        weight: z.number(),
        height: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // save the metrics to the database
      return await ctx.db.student.update({
        where: {
          clerkId: ctx.userId,
        },

        data: {
          weights: {
            create: {
              weight: input.weight,
            },
          },
          heights: {
            create: {
              height: input.height,
            },
          },
        },
      });
    }),
});
