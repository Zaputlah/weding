export const invitationPath = '/undangan/kebun-senja/reza-fitri';

export function guestNameFromRequest(request) {
  const value = new URL(request.url, 'https://weding-sage.vercel.app').searchParams.get('to');
  const name = value?.trim().replace(/\s+/gu, ' ').slice(0, 120) ?? '';
  return !/\p{N}/u.test(name) && (name.match(/\p{L}/gu)?.length ?? 0) >= 3 ? name : null;
}

export function escapeMarkup(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function requestOrigin(request) {
  const host = String(request.headers['x-forwarded-host'] || request.headers.host || '').split(',')[0].trim();
  const protocol = String(request.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  if (/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host) && /^(https?|http)$/.test(protocol)) {
    return `${protocol}://${host}`;
  }
  return 'https://weding-sage.vercel.app';
}
