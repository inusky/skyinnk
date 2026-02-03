import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const auth0Client = useAuth0(event);
  const user = await auth0Client.getUser();
  const auth0Id = user?.sub;
  if (!auth0Id) throw createError({ statusCode: 401 });

  const primaryEmail = (user?.email as string | undefined) ?? null;

  const fallbackName = [user?.given_name, user?.family_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  const fullName = (user?.name as string | undefined) ?? (fallbackName || null);

  const imageUrl = (user?.picture as string | undefined) ?? null;

  const existing = await prisma.user.findUnique({
    where: { auth0Id },
    select: { deletedAt: true },
  });
  if (existing?.deletedAt)
    throw createError({ statusCode: 403, statusMessage: 'Account deleted' });

  await prisma.user.upsert({
    where: { auth0Id },
    update: {
      email: primaryEmail ?? undefined,
      name: fullName ?? undefined,
      imageUrl: imageUrl ?? undefined,
    },
    create: {
      auth0Id,
      email: primaryEmail ?? null,
      name: fullName ?? null,
      imageUrl,
    },
  });

  return { ok: true };
});
