import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const { id }: any = getQuery(event);

  const chapters = await prisma.chapter.findMany({
    where: { courseId: id },
    orderBy: { updatedAt: 'asc' },
  });

  return { chapters };
});
