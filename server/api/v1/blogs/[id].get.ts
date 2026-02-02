import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const { id }: any = event.context.params;

  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  return { blog };
});
