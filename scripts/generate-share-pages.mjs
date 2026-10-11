import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

// Generate real HTML per invitation so link crawlers need no JavaScript.
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist/undangan-app/browser');
const template = await readFile(resolve(output, 'index.html'), 'utf8');
const source = await readFile(resolve(root, 'src/app/invitation-access.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { CUSTOMER_INVITATIONS } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);
const origin = new URL(process.env.SITE_URL || 'https://weding-sage.vercel.app').origin;
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

for (const invitation of CUSTOMER_INVITATIONS) {
  const { themeSlug, customerSlug, coupleName, event } = invitation;
  if (![themeSlug, customerSlug].every((slug) => /^[a-z0-9-]+$/.test(slug))) {
    throw new Error('Invalid invitation slug');
  }
  const title = `Undangan Pernikahan ${coupleName}`;
  const date = event?.date ? new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full', timeZone: 'Asia/Jakarta',
  }).format(new Date(`${event.date}T12:00:00+07:00`)) : '';
  const description = `${date ? `${date}. ` : ''}Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan ${coupleName}.`;
  const url = `${origin}/undangan/${themeSlug}/${customerSlug}`;
  let imagePath = `/assets/scrapbook-${themeSlug}.jpg`;
  try {
    await access(resolve(output, imagePath.slice(1)));
  } catch {
    imagePath = '/assets/mempelai-pasangan-setelah-akad.png';
    await access(resolve(output, imagePath.slice(1)));
  }
  const image = `${origin}${imagePath}`;
  const metadata = [
    ['property', 'og:type', 'website'],
    ['property', 'og:locale', 'id_ID'],
    ['property', 'og:site_name', 'Undangan Pernikahan'],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['property', 'og:image:alt', `Ilustrasi undangan pernikahan ${coupleName}`],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', image],
  ].map(([attribute, key, value]) => `    <meta ${attribute}="${key}" content="${escape(value)}" />`).join('\n');
  const html = template
    .replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(description)}" />`)
    .replace('</head>', `${metadata}\n    <link rel="canonical" href="${escape(url)}" />\n  </head>`);
  const destination = resolve(output, 'undangan', themeSlug, customerSlug, 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
}
console.log(`Generated share metadata for ${CUSTOMER_INVITATIONS.length} invitations.`);
