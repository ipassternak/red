-- CreateEnum
CREATE TYPE "quest_task_type" AS ENUM ('QUESTION', 'TRANSITION');

-- CreateTable
CREATE TABLE "quest_scenes" (
    "id" VARCHAR(36) NOT NULL,
    "quest_id" VARCHAR(36) NOT NULL,
    "label" VARCHAR(64) NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quest_scenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quest_interactions" (
    "id" VARCHAR(36) NOT NULL,
    "quest_scene_id" VARCHAR(36) NOT NULL,
    "type" "quest_task_type" NOT NULL,
    "penalty" INTEGER NOT NULL DEFAULT 0,
    "dx" DOUBLE PRECISION NOT NULL,
    "dy" DOUBLE PRECISION NOT NULL,
    "radius" INTEGER NOT NULL,
    "label" VARCHAR(64),
    "tempalte" VARCHAR(64),
    "settings" TEXT,
    "answers" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quest_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scene_transitions" (
    "interaction_id" VARCHAR(36) NOT NULL,
    "scene_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "scene_transitions_pkey" PRIMARY KEY ("interaction_id","scene_id")
);

-- CreateTable
CREATE TABLE "interaction_locks" (
    "dependant_id" VARCHAR(36) NOT NULL,
    "dependency_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "interaction_locks_pkey" PRIMARY KEY ("dependant_id","dependency_id")
);

-- AddForeignKey
ALTER TABLE "quest_scenes" ADD CONSTRAINT "quest_scenes_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_interactions" ADD CONSTRAINT "quest_interactions_quest_scene_id_fkey" FOREIGN KEY ("quest_scene_id") REFERENCES "quest_scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_transitions" ADD CONSTRAINT "scene_transitions_interaction_id_fkey" FOREIGN KEY ("interaction_id") REFERENCES "quest_interactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scene_transitions" ADD CONSTRAINT "scene_transitions_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "quest_scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction_locks" ADD CONSTRAINT "interaction_locks_dependant_id_fkey" FOREIGN KEY ("dependant_id") REFERENCES "quest_interactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction_locks" ADD CONSTRAINT "interaction_locks_dependency_id_fkey" FOREIGN KEY ("dependency_id") REFERENCES "quest_interactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
