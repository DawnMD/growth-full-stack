import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const commonRouter = createTRPCRouter({
  checkUserExists: protectedProcedure.query(async ({ ctx }) => {
    const [employee, student] = await Promise.all([
      ctx.db.employee.findUnique({
        where: { clerkId: ctx.userId },
      }),
      ctx.db.student.findUnique({
        where: { clerkId: ctx.userId },
      }),
    ]);

    return employee?.type ?? student?.type;
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
