/*
  Warnings:

  - Added the required column `m3u8Url` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "m3u8Url",
ADD COLUMN     "m3u8Url" JSONB NOT NULL;
