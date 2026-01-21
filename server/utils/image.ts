export const normalizeImageUrl = (value: string | null | undefined) => {
  if (!value) return value ?? '';
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  return `https://${trimmed}`;
};
