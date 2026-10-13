import { escapeMarkup, guestNameFromRequest, invitationPath, requestOrigin } from '../server/guest-preview.mjs';

export default function handler(request, response) {
  const name = guestNameFromRequest(request);
  if (!name) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('Nama tamu harus berisi minimal tiga huruf dan tanpa angka.');
    return;
  }

  const origin = requestOrigin(request);
  const encodedName = encodeURIComponent(name);
  const invitationUrl = `${origin}${invitationPath}?v=2#to=${encodedName}`;
  const shareUrl = `${origin}/api/share?to=${encodedName}`;
  const imageUrl = `${origin}/api/og?to=${encodedName}`;
  const title = `Undangan untuk ${name} | Reza & Fitri`;
  const description = `Kepada Yth. ${name}, kami mengundang Anda ke walimah Reza & Fitri pada Ahad, 8 November 2026.`;
  const redirectScript = JSON.stringify(invitationUrl).replace(/</g, '\\u003c');

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
  response.end(`<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${escapeMarkup(title)}</title>
  <meta name="description" content="${escapeMarkup(description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="id_ID">
  <meta property="og:title" content="${escapeMarkup(title)}">
  <meta property="og:description" content="${escapeMarkup(description)}">
  <meta property="og:url" content="${escapeMarkup(shareUrl)}">
  <meta property="og:image" content="${escapeMarkup(imageUrl)}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1200">
  <meta property="og:image:alt" content="Amplop undangan Reza dan Fitri untuk ${escapeMarkup(name)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeMarkup(title)}">
  <meta name="twitter:image" content="${escapeMarkup(imageUrl)}">
  <script>window.location.replace(${redirectScript});</script>
</head>
<body>
  <p>Membuka undangan untuk ${escapeMarkup(name)}… <a href="${escapeMarkup(invitationUrl)}">Buka undangan</a></p>
</body>
</html>`);
}
