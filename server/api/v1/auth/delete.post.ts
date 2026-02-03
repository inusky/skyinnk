import { prisma } from '~~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const auth0Client = useAuth0(event);
    const user = await auth0Client.getUser();
    const auth0Id = user?.sub;
    if (!auth0Id) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    const existing = await prisma.user.findUnique({
      where: { auth0Id },
      select: { deletedAt: true },
    });

    if (existing?.deletedAt) {
      return { ok: true, alreadyDeleted: true };
    }

    await prisma.user.upsert({
      where: { auth0Id },
      update: { deletedAt: new Date() },
      create: { auth0Id, deletedAt: new Date() },
    });

    const { auth0Management, auth0 } = useRuntimeConfig();
    const mgmtDomainRaw =
      auth0Management?.domain || auth0?.domain || process.env.AUTH0_DOMAIN;
    const mgmtDomain = mgmtDomainRaw?.replace(/^https?:\/\//, '');
    const mgmtClientId =
      auth0Management?.clientId || process.env.AUTH0_MGMT_CLIENT_ID;
    const mgmtClientSecret =
      auth0Management?.clientSecret || process.env.AUTH0_MGMT_CLIENT_SECRET;
    const mgmtAudience =
      auth0Management?.audience ||
      (mgmtDomain ? `https://${mgmtDomain}/api/v2/` : undefined);

    if (!mgmtDomain || !mgmtClientId || !mgmtClientSecret || !mgmtAudience) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Auth0 Management API not configured',
      });
    }

    const tokenResponse = await fetch(`https://${mgmtDomain}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: mgmtClientId,
        client_secret: mgmtClientSecret,
        audience: mgmtAudience,
      }),
    });

    if (!tokenResponse.ok) {
      const details = await tokenResponse.text();
      throw createError({
        statusCode: 502,
        statusMessage: 'Auth0 token request failed',
        data: { details },
      });
    }

    const { access_token: accessToken } = (await tokenResponse.json()) as {
      access_token?: string;
    };

    if (!accessToken) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Auth0 token missing access_token',
      });
    }

    const deleteResponse = await fetch(
      `https://${mgmtDomain}/api/v2/users/${encodeURIComponent(auth0Id)}`,
      {
        method: 'DELETE',
        headers: { authorization: `Bearer ${accessToken}` },
      },
    );

    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      const details = await deleteResponse.text();
      throw createError({
        statusCode: 502,
        statusMessage: 'Auth0 delete failed',
        data: { details },
      });
    }

    return { ok: true, deleted: true };
  } catch (err: any) {
    console.error('DELETE FAILED:', err);
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.message || 'Delete failed',
      data: { auth0: err?.errors ?? err },
    });
  }
});
