-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Not_started', 'In_progress', 'Blocked', 'Completed', 'Cancelled');

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Not_started',
    "due_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
