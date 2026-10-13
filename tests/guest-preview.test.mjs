import assert from 'node:assert/strict';
import { test } from 'node:test';
import sharp from 'sharp';
import shareHandler from '../api/share.mjs';
import imageHandler from '../api/og.mjs';

function response() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
    end(body) { this.body = body; },
  };
}

function request(name) {
  return {
    url: `/api/share?to=${encodeURIComponent(name)}`,
    headers: { host: 'weding-sage.vercel.app', 'x-forwarded-proto': 'https' },
  };
}

test('share page exposes the guest image to crawlers and opens the named invitation', () => {
  const result = response();
  shareHandler(request('Budi'), result);
  assert.equal(result.statusCode, 200);
  assert.match(result.body, /og:image" content="https:\/\/weding-sage\.vercel\.app\/api\/og\?to=Budi/);
  assert.match(result.body, /og:title" content="Undangan untuk Budi \| Reza &amp; Fitri/);
  assert.ok(result.body.includes('window.location.replace("https://weding-sage.vercel.app/undangan/kebun-senja/reza-fitri?v=2#to=Budi")'));
});

test('guest name is escaped in share markup', () => {
  const result = response();
  shareHandler(request('Budi <script>'), result);
  assert.doesNotMatch(result.body, /<script>\s*Budi/);
  assert.match(result.body, /Budi &lt;script&gt;/);
});

test('invalid guest names are rejected', async () => {
  const page = response();
  const image = response();
  shareHandler(request('A2'), page);
  await imageHandler(request('A2'), image);
  assert.equal(page.statusCode, 400);
  assert.equal(image.statusCode, 400);
});

test('preview image is a personalized square PNG', async () => {
  const budi = response();
  const andi = response();
  await imageHandler(request('Budi'), budi);
  await imageHandler(request('Andi'), andi);
  assert.equal(budi.statusCode, 200);
  assert.equal(budi.headers['content-type'], 'image/png');
  assert.deepEqual(await sharp(budi.body).metadata().then(({ width, height, format }) => ({ width, height, format })), {
    width: 1200, height: 1200, format: 'png',
  });
  assert.notDeepEqual(budi.body, andi.body);
});
