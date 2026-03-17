import type { User } from '@prisma/client';
import type { H3Event } from 'h3';

import { useAuth0 } from '#imports';

import { prisma } from '~~/server/utils/prisma';

export interface AuthIdentity {
  auth0Id: string;
  email: string | null;
  name: string | null;
  imageUrl: string | null;
}

export interface SerializedUser {
  id: string;
  auth0Id: string;
  email: string;
  name: string;
  mobile: string | null;
  imageUrl: string | null;
  deletedAt: string | null;
}

const toOptionalString = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

export const serializeUser = (user: User | null): SerializedUser | null => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    auth0Id: user.auth0Id,
    email: user.email,
    name: user.name,
    mobile: user.mobile,
    imageUrl: user.imageUrl,
    deletedAt: user.deletedAt?.toISOString() ?? null,
  };
};

export const getAuthUserContext = async (event: H3Event) => {
  const auth0 = useAuth0(event);
  const session = await auth0.getSession();
  const auth0Id = toOptionalString(session?.user?.sub);

  if (!auth0Id) {
    return {
      authenticated: false as const,
      identity: null,
      user: null,
    };
  }

  const identity: AuthIdentity = {
    auth0Id,
    email: toOptionalString(session?.user?.email),
    name: toOptionalString(session?.user?.name),
    imageUrl: toOptionalString(session?.user?.picture),
  };

  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  return {
    authenticated: true as const,
    identity,
    user,
  };
};
