import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// import { z } from "zod";

const growthModelResponseDummy = {
  predictions: {
    height: 140.0,
    weight: 47.7,
  },
  units: {
    height: "cm",
    weight: "kg",
  },
  validation: {
    bmi: 24.4,
    is_valid: true,
  },
};

export const growthRouter = createTRPCRouter({
  addHeightImage: protectedProcedure
    // .input(z.object({ image: z.instanceof(File) }))
    .mutation(async ({ ctx }) => {
      // Return the dummy response as if the model was called from the server with 2 seconds delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // save the image to the database
      return await ctx.db.user.update({
        where: {
          clerkId: ctx.userId,
        },
        data: {
          height: {
            create: {
              height: growthModelResponseDummy.predictions.height,
            },
          },
        },
        include: {
          height: true,
        },
      });
    }),
});
