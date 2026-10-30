// Never pass unchecked configuration values into href attributes.
export function externalURL(value, { github = false, repository = false } = {}) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    if (github || repository) {
      if (url.hostname !== 'github.com') return null;
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length < (repository ? 2 : 1)) return null;
      if (repository && segments.length !== 2) return null;
    }
    return url.href;
  } catch { return null; }
}

export function emailURL(value) {
  if (typeof value !== 'string' || !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)) return null;
  return `mailto:${encodeURIComponent(value).replace(/%40/g, '@')}`;
}
