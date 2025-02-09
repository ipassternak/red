/*
  Warnings:

  - You are about to drop the column `tempalte` on the `quest_interactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "quest_interactions" DROP COLUMN "tempalte",
ADD COLUMN     "template" VARCHAR(64);
