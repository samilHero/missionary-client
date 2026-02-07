/*
  Warnings:

  - You are about to drop the `mission_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `missions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'KAKAO');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "MissionaryRegionType" AS ENUM ('DOMESTIC', 'ABROAD');

-- CreateEnum
CREATE TYPE "MissionaryBoardType" AS ENUM ('NOTICE', 'BUS', 'ACCOMMODATION', 'FAQ', 'SCHEDULE');

-- CreateEnum
CREATE TYPE "MissionaryStaffRole" AS ENUM ('LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "TermsType" AS ENUM ('USING_OF_SERVICE', 'PROCESSING_POLICY_OF_PRIVATE_INFO', 'USING_OF_PRIVATE_INFO', 'OFFERING_PRIVATE_INFO_TO_THIRD_PARTY');

-- DropForeignKey
ALTER TABLE "mission_members" DROP CONSTRAINT "mission_members_mission_id_fkey";

-- DropForeignKey
ALTER TABLE "mission_members" DROP CONSTRAINT "mission_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "missions" DROP CONSTRAINT "missions_created_by_id_fkey";

-- DropTable
DROP TABLE "mission_members";

-- DropTable
DROP TABLE "missions";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "MissionMemberRole";

-- DropEnum
DROP TYPE "MissionType";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "password" TEXT,
    "provider" "AuthProvider" DEFAULT 'LOCAL',
    "provider_id" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "login_id" TEXT,
    "identity_number" TEXT,
    "phone_number" TEXT,
    "birth_date" TIMESTAMP(3),
    "gender" TEXT,
    "is_baptized" BOOLEAN NOT NULL DEFAULT false,
    "baptized_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missionary_region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MissionaryRegionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "missionary_region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missionary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "pastor_name" TEXT,
    "pastor_phone" TEXT,
    "participation_start_date" TIMESTAMP(3) NOT NULL,
    "participation_end_date" TIMESTAMP(3) NOT NULL,
    "price" INTEGER,
    "description" TEXT,
    "maximum_participant_count" INTEGER,
    "current_participant_count" INTEGER NOT NULL DEFAULT 0,
    "bank_name" TEXT,
    "bank_account_holder" TEXT,
    "bank_account_number" TEXT,
    "status" "MissionStatus" NOT NULL DEFAULT 'RECRUITING',
    "region_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "missionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missionary_poster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "missionary_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "missionary_poster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missionary_staff" (
    "id" TEXT NOT NULL,
    "role" "MissionaryStaffRole" NOT NULL,
    "missionary_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "missionary_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missionary_church" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "visit_purpose" TEXT,
    "pastor_name" TEXT,
    "pastor_phone" TEXT,
    "address_basic" TEXT,
    "address_detail" TEXT,
    "missionary_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "missionary_church_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missionary_board" (
    "id" TEXT NOT NULL,
    "type" "MissionaryBoardType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "missionary_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "missionary_board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missionary_board_file" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "missionary_board_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "missionary_board_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "apply_fee" INTEGER,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "identification_number" TEXT,
    "is_own_car" BOOLEAN NOT NULL DEFAULT false,
    "missionary_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "member_id" TEXT,
    "team_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "leader_user_id" TEXT NOT NULL,
    "leader_user_name" TEXT NOT NULL,
    "missionary_id" TEXT NOT NULL,
    "church_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_member" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "team_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "church" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pastor_name" TEXT,
    "pastor_phone" TEXT,
    "address_basic" TEXT,
    "address_detail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "church_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms" (
    "terms_id" TEXT NOT NULL,
    "terms_type" "TermsType" NOT NULL,
    "terms_url" TEXT,
    "terms_title" TEXT NOT NULL,
    "terms_description" TEXT,
    "is_used" BOOLEAN NOT NULL DEFAULT true,
    "is_essential" BOOLEAN NOT NULL DEFAULT false,
    "seq" SERIAL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "terms_pkey" PRIMARY KEY ("terms_id")
);

-- CreateTable
CREATE TABLE "terms_content" (
    "terms_content_id" TEXT NOT NULL,
    "terms_type" "TermsType" NOT NULL,
    "terms_title" TEXT NOT NULL,
    "terms_contents" TEXT NOT NULL,
    "terms_apply_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "terms_content_pkey" PRIMARY KEY ("terms_content_id")
);

-- CreateTable
CREATE TABLE "user_terms_agreement" (
    "user_terms_agreement_id" TEXT NOT NULL,
    "is_agreed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "terms_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_terms_agreement_pkey" PRIMARY KEY ("user_terms_agreement_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_provider_provider_id_key" ON "user"("provider", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "missionary_staff_missionary_id_user_id_key" ON "missionary_staff"("missionary_id", "user_id");

-- AddForeignKey
ALTER TABLE "missionary" ADD CONSTRAINT "missionary_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "missionary_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missionary" ADD CONSTRAINT "missionary_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missionary_poster" ADD CONSTRAINT "missionary_poster_missionary_id_fkey" FOREIGN KEY ("missionary_id") REFERENCES "missionary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missionary_staff" ADD CONSTRAINT "missionary_staff_missionary_id_fkey" FOREIGN KEY ("missionary_id") REFERENCES "missionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missionary_staff" ADD CONSTRAINT "missionary_staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missionary_church" ADD CONSTRAINT "missionary_church_missionary_id_fkey" FOREIGN KEY ("missionary_id") REFERENCES "missionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missionary_board" ADD CONSTRAINT "missionary_board_missionary_id_fkey" FOREIGN KEY ("missionary_id") REFERENCES "missionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missionary_board_file" ADD CONSTRAINT "missionary_board_file_missionary_board_id_fkey" FOREIGN KEY ("missionary_board_id") REFERENCES "missionary_board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation" ADD CONSTRAINT "participation_missionary_id_fkey" FOREIGN KEY ("missionary_id") REFERENCES "missionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation" ADD CONSTRAINT "participation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation" ADD CONSTRAINT "participation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_missionary_id_fkey" FOREIGN KEY ("missionary_id") REFERENCES "missionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "church"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_terms_agreement" ADD CONSTRAINT "user_terms_agreement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_terms_agreement" ADD CONSTRAINT "user_terms_agreement_terms_id_fkey" FOREIGN KEY ("terms_id") REFERENCES "terms"("terms_id") ON DELETE RESTRICT ON UPDATE CASCADE;
