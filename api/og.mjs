import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { escapeMarkup, guestNameFromRequest } from '../server/guest-preview.mjs';

const backgroundPath = fileURLToPath(new URL('../public/assets/scrapbook-kebun-senja.jpg', import.meta.url));

function previewLines(name) {
  const displayName = name.length > 64 ? `${name.slice(0, 63).trimEnd()}…` : name;
  if (displayName.length <= 23) return [displayName];
  const words = displayName.split(' ');
  const first = [];
  const second = [];
  for (const word of words) {
    const candidate = [...first, word].join(' ');
    if (candidate.length <= Math.ceil(displayName.length / 2) || first.length === 0) first.push(word);
    else second.push(word);
  }
  const shorten = (text) => text.length > 32 ? `${text.slice(0, 31).trimEnd()}…` : text;
  if (second.length === 0) return [shorten(displayName)];
  return [shorten(first.join(' ')), shorten(second.join(' '))];
}

function envelopeOverlay(name) {
  const lines = previewLines(name);
  const fontSize = lines.length === 1 ? (lines[0].length > 24 ? 52 : lines[0].length > 17 ? 62 : 76) : 53;
  const firstY = lines.length === 1 ? 423 : 402;
  const nameText = lines.map((line, index) =>
    `<text x="600" y="${firstY + index * 62}" text-anchor="middle" fill="#fff6e7" font-family="Georgia,serif" font-size="${fontSize}" font-weight="bold">${escapeMarkup(line)}</text>`,
  ).join('');

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <defs>
      <linearGradient id="envelope" x1="0" x2="1" y1="0" y2="1">
        <stop stop-color="#a1785e"/><stop offset=".55" stop-color="#76503d"/><stop offset="1" stop-color="#503428"/>
      </linearGradient>
      <linearGradient id="pocket" x1="0" x2="0" y1="0" y2="1">
        <stop stop-color="#674331"/><stop offset="1" stop-color="#34241e"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="1200" fill="#221712" fill-opacity=".28"/>
    <text x="600" y="126" text-anchor="middle" fill="#e8bd7d" font-family="Georgia,serif" font-size="30" letter-spacing="7">UNDANGAN WALIMATUL ’URS</text>
    <rect x="100" y="236" width="1020" height="700" rx="8" fill="#150f0c" fill-opacity=".42"/>
    <rect x="90" y="220" width="1020" height="700" rx="7" fill="url(#envelope)" stroke="#c49b6d" stroke-width="3"/>
    <path d="M90 220 L600 565 L90 494 Z" fill="#533729" fill-opacity=".85"/>
    <path d="M1110 220 L600 565 L1110 494 Z" fill="#4b3127" fill-opacity=".85"/>
    <text x="600" y="336" text-anchor="middle" fill="#e7cda7" font-family="Georgia,serif" font-size="26" font-weight="bold" letter-spacing="5">KEPADA YTH.</text>
    ${nameText}
    <path d="M90 494 L600 665 L1110 494 L1110 920 L90 920 Z" fill="url(#pocket)" stroke="#9c7656" stroke-width="2"/>
    <path d="M90 920 L600 665 L1110 920" fill="none" stroke="#b58a62" stroke-opacity=".48" stroke-width="3"/>
    <rect x="551" y="617" width="98" height="98" rx="13" transform="rotate(45 600 666)" fill="#b8874d" stroke="#f2d19b" stroke-width="3"/>
    <text x="600" y="681" text-anchor="middle" fill="#4a2f22" font-family="Georgia,serif" font-size="36" font-weight="bold">R&amp;F</text>
    <rect x="414" y="779" width="372" height="86" rx="43" fill="#f5e8d1"/>
    <text x="600" y="833" text-anchor="middle" fill="#49372b" font-family="Arial,sans-serif" font-size="27" font-weight="bold" letter-spacing="2">BUKA UNDANGAN</text>
    <text x="600" y="1034" text-anchor="middle" fill="#f4dfbd" font-family="Georgia,serif" font-size="27" letter-spacing="4">REZA &amp; FITRI · 08 NOVEMBER 2026</text>
  </svg>`);
}

export default async function handler(request, response) {
  const name = guestNameFromRequest(request);
  if (!name) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('Nama tamu tidak valid.');
    return;
  }

  try {
    const background = await readFile(backgroundPath);
    const image = await sharp(background)
      .resize(1200, 1200, { fit: 'cover' })
      .modulate({ brightness: 0.52, saturation: 0.75 })
      .composite([{ input: envelopeOverlay(name) }])
      .png()
      .toBuffer();
    response.setHeader('Content-Type', 'image/png');
    response.setHeader('Content-Length', String(image.length));
    response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    response.end(image);
  } catch (error) {
    console.error('Could not generate guest preview image:', error);
    response.statusCode = 500;
    response.end('Gambar pratinjau tidak tersedia.');
  }
}
