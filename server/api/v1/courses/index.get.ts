import { prisma } from '~~/server/utils/prisma';
import { normalizeImageUrl } from '~~/server/utils/image';

export default defineEventHandler(async () => {
  const courses = await prisma.course.findMany({
    where: {},
    orderBy: { updatedAt: 'desc' },
  });

  return {
    courses: courses.map((course) => ({
      ...course,
      image: normalizeImageUrl(course.image),
    })),
  };
});
