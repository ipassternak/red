/*
  Warnings:

  - Added the required column `background` to the `quest_scenes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quest_scenes" ADD COLUMN     "background" JSON NOT NULL;
