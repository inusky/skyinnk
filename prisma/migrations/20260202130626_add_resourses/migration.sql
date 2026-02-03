-- CreateTable
CREATE TABLE "Resourses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "PDFUrl" TEXT NOT NULL,
    "PPTUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resourses_pkey" PRIMARY KEY ("id")
);
