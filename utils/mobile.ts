export const MOBILE_ERROR_MESSAGE =
  'Enter a valid mobile number with at least 10 digits.';

const STRIPPED_CHARS = /[\s()-]/g;
const PLUS_FORMAT = /^\+\d{10,15}$/;
const INDIA_LOCAL_FORMAT = /^\d{10}$/;
const INDIA_WITH_CODE_FORMAT = /^91\d{10}$/;

export const normalizeMobile = (input?: string | null) => {
  const value = typeof input === 'string' ? input.trim() : '';

  if (!value) {
    return null;
  }

  const sanitized = value.replace(STRIPPED_CHARS, '');

  if (sanitized.startsWith('+')) {
    if (!PLUS_FORMAT.test(sanitized)) {
      throw new Error(MOBILE_ERROR_MESSAGE);
    }

    return sanitized;
  }

  if (INDIA_LOCAL_FORMAT.test(sanitized)) {
    return `+91${sanitized}`;
  }

  if (INDIA_WITH_CODE_FORMAT.test(sanitized)) {
    return `+${sanitized}`;
  }

  throw new Error(MOBILE_ERROR_MESSAGE);
};
