-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "timeSlots" TEXT[] DEFAULT ARRAY[]::TEXT[];
