/*
  Warnings:

  - Added the required column `quest_id` to the `quest_interactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quest_interactions" ADD COLUMN     "quest_id" VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE "quest_interactions" ADD CONSTRAINT "quest_interactions_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
