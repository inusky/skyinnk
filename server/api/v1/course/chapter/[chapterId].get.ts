import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const { chapterId }: any = event.context.params;
  const { id }: any = getQuery(event);

  const lessons = await prisma.lesson.findMany({
    where: {
      chapterId,
      courseId: id,
    },
  });

  return { lessons };
});
