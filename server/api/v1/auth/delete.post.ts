import { clerkClient } from '@clerk/nuxt/server';
import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const { userId, isAuthenticated } = event.context.auth();
    if (!isAuthenticated || !userId) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    const existing = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { deletedAt: true },
    });

    if (existing?.deletedAt) {
      return { ok: true, alreadyDeleted: true };
    }

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { deletedAt: new Date() },
      create: { clerkId: userId, deletedAt: new Date() },
    });

    try {
      await clerkClient(event).users.deleteUser(userId);
    } catch (err: any) {
      if (err?.status !== 404) {
        throw err;
      }
    }

    return { ok: true, deleted: true };
  } catch (err: any) {
    console.error('DELETE FAILED:', err);
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.message || 'Delete failed',
      data: { clerk: err?.errors ?? err },
    });
  }
});
