# Undangan Pernikahan Angular

Website undangan pernikahan statis menggunakan Angular, TypeScript, dan Tailwind CSS. Tidak menggunakan backend, database, daftar tamu Excel, RSVP, atau halaman admin.

Tamu mengetik namanya pada sampul. Nama hanya digunakan selama halaman sedang dibuka dan tidak disimpan di browser.

## Menjalankan

```powershell
npm.cmd install
npm.cmd start
```

Buka `http://localhost:4200/undangan`.

## Production build

```powershell
npm.cmd run build
```

Hasil build berada di `dist/undangan-app/browser` dan dapat diunggah ke hosting statis seperti Netlify, Vercel, GitHub Pages, atau hosting biasa.
