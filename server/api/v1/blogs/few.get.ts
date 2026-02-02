import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async () => {
  const blogs = await prisma.blog.findMany({
    take: 10,
    where: {},
    select: {
      id: true,
      title: true,
      description: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  return {
    blogs,
  };
});
