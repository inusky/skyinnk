import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const { id }: any = event.context.params;
  const { chapterId, courseId }: any = getQuery(event);

  const lessons = await prisma.lesson.findMany({
    where: {
      id,
      chapterId,
      courseId,
    },
    orderBy: { updatedAt: 'asc' },
  });

  return { lessons };
});
