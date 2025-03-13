/*
  Warnings:

  - You are about to drop the column `category` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the `Show_Genre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Show_Genre" DROP CONSTRAINT "Show_Genre_genreId_fkey";

-- DropForeignKey
ALTER TABLE "Show_Genre" DROP CONSTRAINT "Show_Genre_showId_fkey";

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "category",
ALTER COLUMN "platform" DROP NOT NULL,
ALTER COLUMN "seasons" DROP NOT NULL,
ALTER COLUMN "episodes" DROP NOT NULL;

-- DropTable
DROP TABLE "Show_Genre";

-- CreateTable
CREATE TABLE "_ShowGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ShowGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ShowGenres_B_index" ON "_ShowGenres"("B");

-- AddForeignKey
ALTER TABLE "_ShowGenres" ADD CONSTRAINT "_ShowGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowGenres" ADD CONSTRAINT "_ShowGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
