import { prisma } from '~~/server/utils/prisma';
import { normalizeImageUrl } from '~~/server/utils/image';

export default defineEventHandler(async (event) => {
  const { id }: any = event.context.params;

  const course = await prisma.course.findUnique({
    where: { id },
  });

  return {
    course: course
      ? {
          ...course,
          image: normalizeImageUrl(course.image),
        }
      : null,
  };
});
