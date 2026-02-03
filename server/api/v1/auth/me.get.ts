import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const auth0Client = useAuth0(event);
  const user = await auth0Client.getUser();
  const auth0Id = user?.sub;

  if (!auth0Id) {
    return { authenticated: false };
  }

  const dbUser = await prisma.user.findUnique({
    where: { auth0Id },
    select: {
      id: true,
      auth0Id: true,
      email: true,
      name: true,
      imageUrl: true,
      deletedAt: true,
    },
  });

  if (dbUser?.deletedAt) {
    return { authenticated: false, user: null };
  }

  return {
    authenticated: true,
    user: dbUser,
    auth0User: user,
  };
});
