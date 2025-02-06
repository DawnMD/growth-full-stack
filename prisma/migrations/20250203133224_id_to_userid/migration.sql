-- DropForeignKey
ALTER TABLE "Height" DROP CONSTRAINT "Height_addedById_fkey";

-- DropForeignKey
ALTER TABLE "Height" DROP CONSTRAINT "Height_userId_fkey";

-- DropForeignKey
ALTER TABLE "Weight" DROP CONSTRAINT "Weight_addedById_fkey";

-- DropForeignKey
ALTER TABLE "Weight" DROP CONSTRAINT "Weight_userId_fkey";

-- AddForeignKey
ALTER TABLE "Height" ADD CONSTRAINT "Height_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Height" ADD CONSTRAINT "Height_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weight" ADD CONSTRAINT "Weight_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weight" ADD CONSTRAINT "Weight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
