import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const { chapterId }: any = event.context.params;
  const { id }: any = getQuery(event);

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: { title: true, courseId: true },
  });

  if (!chapter || chapter.courseId !== id) {
    throw createError({ statusCode: 404 });
  }

  const lessons = await prisma.lesson.findMany({
    where: {
      chapterId,
      courseId: id,
    },
  });

  return { lessons, chapter: { title: chapter.title } };
});
