import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const { userId, sessionClaims } = event.context.auth();
  if (!userId) throw createError({ statusCode: 401 });

  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: (sessionClaims?.email as string) || '',
    },
  });

  return { ok: true };
});
