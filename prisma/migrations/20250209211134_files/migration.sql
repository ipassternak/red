/*
  Warnings:

  - The `answers` column on the `quest_interactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "quest_interactions" DROP COLUMN "answers",
ADD COLUMN     "answers" JSON;

-- AlterTable
ALTER TABLE "quests" ADD COLUMN     "thumbnail" JSON;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" JSON;
