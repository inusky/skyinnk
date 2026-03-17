import { getAuthUserContext, serializeUser } from '~~/server/utils/auth-user';

export default defineEventHandler(async (event) => {
  const { authenticated, identity, user } = await getAuthUserContext(event);

  return {
    authenticated,
    hasDatabaseUser: Boolean(user),
    identity,
    user: serializeUser(user),
  };
});
