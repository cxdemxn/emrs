/*
  Warnings:

  - A unique constraint covering the columns `[date,timeSlot,timetableId]` on the table `ExamSlot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExamSlot_date_timeSlot_timetableId_key" ON "ExamSlot"("date", "timeSlot", "timetableId");
