-- CreateEnum
CREATE TYPE "quest_status" AS ENUM ('UNPUBLISHED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "quest_difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "quest_attempt_status" AS ENUM ('PENDING', 'SOLVED', 'FAILED');

-- CreateTable
CREATE TABLE "quests" (
    "id" VARCHAR(36) NOT NULL,
    "author_id" VARCHAR(36) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(4000) NOT NULL,
    "status" "quest_status" NOT NULL DEFAULT 'UNPUBLISHED',
    "difficulty" "quest_difficulty" NOT NULL DEFAULT 'MEDIUM',
    "time_limit" INTEGER NOT NULL,
    "total_tasks" INTEGER NOT NULL DEFAULT 0,
    "total_attempts" INTEGER NOT NULL DEFAULT 0,
    "total_solved" INTEGER NOT NULL DEFAULT 0,
    "avg_solved_time" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avg_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quest_reviews" (
    "id" VARCHAR(36) NOT NULL,
    "quest_id" VARCHAR(36) NOT NULL,
    "reviewer_id" VARCHAR(36) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comment" VARCHAR(2000),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quest_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quest_attempts" (
    "id" VARCHAR(36) NOT NULL,
    "quest_id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "status" "quest_attempt_status" NOT NULL DEFAULT 'PENDING',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quest_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quests_title_key" ON "quests"("title");

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_reviews" ADD CONSTRAINT "quest_reviews_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_reviews" ADD CONSTRAINT "quest_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_attempts" ADD CONSTRAINT "quest_attempts_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_attempts" ADD CONSTRAINT "quest_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
