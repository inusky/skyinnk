import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async () => {
  const resourses = await prisma.resourses.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      PDFUrl: true,
      PPTUrl: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  return {
    resourses,
  };
});
