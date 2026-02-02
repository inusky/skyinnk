import { prisma } from '~~/server/utils/prisma';
import { clerkClient } from '@clerk/nuxt/server';

export default defineEventHandler(async (event) => {
  const { userId, isAuthenticated } = event.context.auth();
  if (!userId || !isAuthenticated) throw createError({ statusCode: 401 });

  const user = await clerkClient(event).users.getUser(userId);

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null;

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || null;

  const imageUrl = user.imageUrl ?? null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { deletedAt: true },
  });
  if (existing?.deletedAt)
    throw createError({ statusCode: 403, statusMessage: 'Account deleted' });

  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email: primaryEmail ?? undefined,
      name: fullName ?? undefined,
      imageUrl: imageUrl ?? undefined,
    },
    create: {
      clerkId: userId,
      email: primaryEmail ?? null,
      name: fullName ?? null,
      imageUrl,
    },
  });

  return { ok: true };
});
