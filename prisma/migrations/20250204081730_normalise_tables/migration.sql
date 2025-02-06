/*
  Warnings:

  - You are about to drop the column `userId` on the `Height` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Weight` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Height" DROP CONSTRAINT "Height_addedById_fkey";

-- DropForeignKey
ALTER TABLE "Height" DROP CONSTRAINT "Height_userId_fkey";

-- DropForeignKey
ALTER TABLE "Weight" DROP CONSTRAINT "Weight_addedById_fkey";

-- DropForeignKey
ALTER TABLE "Weight" DROP CONSTRAINT "Weight_userId_fkey";

-- DropIndex
DROP INDEX "Height_userId_idx";

-- DropIndex
DROP INDEX "Weight_addedById_idx";

-- DropIndex
DROP INDEX "Weight_userId_idx";

-- AlterTable
ALTER TABLE "Height" DROP COLUMN "userId",
ADD COLUMN     "studentId" TEXT;

-- AlterTable
ALTER TABLE "Weight" DROP COLUMN "userId",
ADD COLUMN     "studentId" TEXT;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "gender" "Gender",
    "type" "UserType" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "gender" "Gender",
    "type" "UserType" NOT NULL DEFAULT 'STUDENT',
    "age" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "controlledByEmployeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_clerkId_key" ON "Employee"("clerkId");

-- CreateIndex
CREATE INDEX "Employee_clerkId_idx" ON "Employee"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_clerkId_key" ON "Student"("clerkId");

-- CreateIndex
CREATE INDEX "Student_clerkId_idx" ON "Student"("clerkId");

-- CreateIndex
CREATE INDEX "Student_controlledByEmployeeId_idx" ON "Student"("controlledByEmployeeId");

-- CreateIndex
CREATE INDEX "Height_studentId_idx" ON "Height"("studentId");

-- CreateIndex
CREATE INDEX "Weight_studentId_idx" ON "Weight"("studentId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_controlledByEmployeeId_fkey" FOREIGN KEY ("controlledByEmployeeId") REFERENCES "Employee"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Height" ADD CONSTRAINT "Height_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Height" ADD CONSTRAINT "Height_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "Employee"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weight" ADD CONSTRAINT "Weight_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weight" ADD CONSTRAINT "Weight_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "Employee"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;
