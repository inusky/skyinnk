import { createError, readBody } from 'h3';

import { normalizeMobile } from '~~/utils/mobile';
import { getAuthUserContext, serializeUser } from '~~/server/utils/auth-user';
import { prisma } from '~~/server/utils/prisma';

interface CompleteProfileBody {
  name?: unknown;
  mobile?: unknown;
}

const getName = (value: unknown) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

export default defineEventHandler(async (event) => {
  const { authenticated, identity } = await getAuthUserContext(event);

  if (!authenticated || !identity) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Please sign in to complete your profile.',
    });
  }

  if (!identity.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Your Auth0 account is missing an email address.',
    });
  }

  const body = await readBody<CompleteProfileBody>(event);
  const name = getName(body?.name);

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Full name is required.',
    });
  }

  let mobile: string | null = null;

  try {
    mobile = normalizeMobile(
      typeof body?.mobile === 'string' ? body.mobile : null,
    );
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage:
        error instanceof Error ? error.message : 'Enter a valid mobile number.',
    });
  }

  const imageUrl = identity.imageUrl ?? undefined;

  const user = await prisma.user.upsert({
    where: { auth0Id: identity.auth0Id },
    create: {
      auth0Id: identity.auth0Id,
      email: identity.email,
      name,
      mobile,
      imageUrl,
    },
    update: {
      email: identity.email,
      name,
      mobile,
      ...(imageUrl ? { imageUrl } : {}),
    },
  });

  return {
    authenticated: true,
    hasDatabaseUser: true,
    identity,
    user: serializeUser(user),
  };
});
