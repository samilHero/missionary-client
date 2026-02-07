-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('DOMESTIC', 'OVERSEAS');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('RECRUITING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MissionMemberRole" AS ENUM ('LEADER', 'STAFF', 'PARTICIPANT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "password" TEXT,
ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'LOCAL',
ADD COLUMN "provider_id" TEXT,
ADD COLUMN "role" TEXT NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "missions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MissionType" NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'RECRUITING',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "pastor_name" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_members" (
    "id" SERIAL NOT NULL,
    "mission_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "MissionMemberRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_provider_id_key" ON "users"("provider", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "mission_members_mission_id_user_id_key" ON "mission_members"("mission_id", "user_id");

-- CreateIndex
CREATE INDEX "mission_members_mission_id_idx" ON "mission_members"("mission_id");

-- CreateIndex
CREATE INDEX "mission_members_user_id_idx" ON "mission_members"("user_id");

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_members" ADD CONSTRAINT "mission_members_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_members" ADD CONSTRAINT "mission_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
