import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

// const growthModelResponseDummy = {
//   predictions: {
//     height: Math.floor(Math.random() * 100) + 100,
//     weight: 47.7,
//   },
//   units: {
//     height: "cm",
//     weight: "kg",
//   },
//   validation: {
//     bmi: 24.4,
//     is_valid: true,
//   },
// };

export const growthRouter = createTRPCRouter({
  addHealthMetrics: protectedProcedure
    .input(
      z.object({
        weight: z.number(),
        height: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Return the dummy response as if the model was called from the server with 2 seconds delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // save the metrics to the database
      return await ctx.db.user.update({
        where: {
          clerkId: ctx.userId,
        },
        data: {
          weight: {
            create: {
              weight: input.weight,
              addedById: ctx.userId,
            },
          },
          height: {
            create: {
              height: input.height,
              addedById: ctx.userId,
            },
          },
        },
      });
    }),

  getHeightFromImage: protectedProcedure
    .input(z.custom<File>())
    .mutation(async () => {
      // Return the dummy response as if the model was called from the server with 1.5 seconds delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const randomHeight = Math.floor(Math.random() * 100) + 100;

      return randomHeight;
    }),
});
