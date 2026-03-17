/*
  Warnings:

  - A unique constraint covering the columns `[courseId,timetableId]` on the table `ExamSlot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ExamSlot_date_timeSlot_timetableId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ExamSlot_courseId_timetableId_key" ON "ExamSlot"("courseId", "timetableId");
