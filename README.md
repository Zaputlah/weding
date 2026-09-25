# Weding — Undangan Pernikahan Digital

Aplikasi undangan pernikahan digital berbasis Angular dengan katalog tema, halaman undangan personal, galeri, cerita perjalanan pasangan, hitung mundur acara, dan petunjuk lokasi.

Proyek ini berjalan sepenuhnya di sisi klien. Tidak ada backend, database, RSVP, daftar tamu Excel, atau halaman admin. Nama tamu dan tema yang dipilih hanya disimpan di `localStorage` browser.

## Fitur

- Katalog berisi 18 tema undangan.
- Halaman undangan responsif untuk desktop dan perangkat seluler.
- URL personal berdasarkan tema dan nama pelanggan.
- Validasi undangan serta masa berlaku pelanggan.
- Sampul interaktif dengan nama tamu.
- Hitung mundur menuju hari pernikahan.
- Profil kedua mempelai dan kutipan ayat.
- Galeri foto dengan tampilan yang mengikuti tema.
- Cerita perjalanan dari taaruf hingga akad.
- Informasi akad dan walimah, tautan Google Maps, serta kode QR lokasi.
- Navigasi seluler dan animasi berbasis posisi scroll.
- Halaman fallback untuk URL atau undangan yang tidak tersedia.

## Pratinjau aplikasi

### Katalog tema

<p align="center">
  <img src="./public/img/Katalogthema.png" alt="Halaman katalog tema undangan" width="100%" />
</p>

### Semua tema

<table>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/klasik-zamrud.png" alt="Tampilan tema Klasik Zamrud" width="100%" />
      <br />
      <strong>Klasik Zamrud</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/mawar-andalusia.png" alt="Tampilan tema Mawar Andalusia" width="100%" />
      <br />
      <strong>Mawar Andalusia</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/langit-qamar.png" alt="Tampilan tema Langit Qamar" width="100%" />
      <br />
      <strong>Langit Qamar</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/kebun-senja.png" alt="Tampilan tema Kebun Senja" width="100%" />
      <br />
      <strong>Kebun Senja</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/ivory-editorial.png" alt="Tampilan tema Ivory Editorial" width="100%" />
      <br />
      <strong>Ivory Editorial</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/pusaka-jawa.png" alt="Tampilan tema Pusaka Jawa" width="100%" />
      <br />
      <strong>Pusaka Jawa</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/dark-boho.png" alt="Tampilan tema Dark Boho" width="100%" />
      <br />
      <strong>Dark Boho</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/chateau-watercolor.png" alt="Tampilan tema Château Watercolor" width="100%" />
      <br />
      <strong>Château Watercolor</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/mihrab-sage.png" alt="Tampilan tema Mihrab Sage" width="100%" />
      <br />
      <strong>Mihrab Sage</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/surat-terracotta.png" alt="Tampilan tema Surat Terracotta" width="100%" />
      <br />
      <strong>Surat Terracotta</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/mutiara-nikah.png" alt="Tampilan tema Mutiara Nikah" width="100%" />
      <br />
      <strong>Mutiara Nikah</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/naskah-nusantara.png" alt="Tampilan tema Naskah Nusantara" width="100%" />
      <br />
      <strong>Naskah Nusantara</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/priangan-sunda.png" alt="Tampilan tema Priangan Sunda" width="100%" />
      <br />
      <strong>Priangan Sunda</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/ranah-minang.png" alt="Tampilan tema Ranah Minang" width="100%" />
      <br />
      <strong>Ranah Minang</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/rimba-dayak.png" alt="Tampilan tema Rimba Dayak" width="100%" />
      <br />
      <strong>Rimba Dayak</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/bali-agung.png" alt="Tampilan tema Bali Agung" width="100%" />
      <br />
      <strong>Bali Agung</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/pinisi-bugis.png" alt="Tampilan tema Pinisi Bugis" width="100%" />
      <br />
      <strong>Pinisi Bugis</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/kembang-betawi.png" alt="Tampilan tema Kembang Betawi" width="100%" />
      <br />
      <strong>Kembang Betawi</strong>
    </td>
  </tr>
</table>

### Detail halaman undangan

<table>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/thema1.png" alt="Detail halaman undangan bagian 1" width="100%" />
      <br />
      <strong>Tampilan Undangan 1</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/thema2.png" alt="Detail halaman undangan bagian 2" width="100%" />
      <br />
      <strong>Tampilan Undangan 2</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/thema3.png" alt="Detail halaman undangan bagian 3" width="100%" />
      <br />
      <strong>Tampilan Undangan 3</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/thema4.png" alt="Detail halaman undangan bagian 4" width="100%" />
      <br />
      <strong>Tampilan Undangan 4</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./public/img/thema5.png" alt="Detail halaman undangan bagian 5" width="100%" />
      <br />
      <strong>Tampilan Undangan 5</strong>
    </td>
    <td align="center" width="50%">
      <img src="./public/img/thema6.png" alt="Detail halaman undangan bagian 6" width="100%" />
      <br />
      <strong>Tampilan Undangan 6</strong>
    </td>
  </tr>
</table>

## Teknologi

- Angular 21
- TypeScript 5.9
- Tailwind CSS 4
- PostCSS
- RxJS
- npm

## Persyaratan

Pastikan Node.js versi LTS dan npm sudah terpasang. Periksa dengan:

```bash
node --version
npm --version
```

## Instalasi

Clone repository, masuk ke folder proyek, lalu instal dependensi:

```bash
git clone https://github.com/Zaputlah/weding.git
cd weding
npm install
```

Jika proyek sudah tersedia di komputer, cukup jalankan `npm install` dari folder proyek.

## Menjalankan aplikasi

```bash
npm start
```

Buka `http://localhost:4200` di browser. Angular akan memuat ulang halaman secara otomatis ketika source code berubah.

## Daftar rute

| Rute | Keterangan |
| --- | --- |
| `/` | Katalog seluruh tema undangan |
| `/undangan/:themeId` | Pratinjau undangan berdasarkan tema |
| `/undangan/:themeId/:customerSlug` | Undangan personal pelanggan |
| `/undangan` | Halaman tidak tersedia |
| `/halaman-tidak-tersedia` | Halaman fallback |

Contoh URL pratinjau:

```text
http://localhost:4200/undangan/mawar-andalusia
```

Contoh URL pelanggan:

```text
http://localhost:4200/undangan/mawar-andalusia/andiani-putra
```

## Menambah undangan pelanggan

Data pelanggan berada di `src/app/invitation-access.ts`. Tambahkan objek baru ke dalam `CUSTOMER_INVITATIONS`:

```ts
{
  themeSlug: 'mawar-andalusia',
  customerSlug: 'nama-pelanggan',
  coupleName: 'Nama Mempelai Wanita & Nama Mempelai Pria',
  brideFullName: 'Nama Lengkap Mempelai Wanita',
  groomFullName: 'Nama Lengkap Mempelai Pria',
  expiresAt: '2027-01-31T23:59:59+07:00',
},
```

Ketentuan field:

- `themeSlug`: harus sama dengan slug tema yang tersedia.
- `customerSlug`: bagian unik pada URL pelanggan; gunakan huruf kecil dan tanda hubung.
- `coupleName`: nama singkat pasangan yang tampil pada undangan.
- `brideFullName` dan `groomFullName`: nama lengkap masing-masing mempelai.
- `expiresAt`: batas waktu akses dalam format ISO 8601 beserta zona waktu.

Undangan baru kemudian dapat dibuka melalui:

```text
/undangan/{themeSlug}/{customerSlug}
```

## Kustomisasi

File utama yang biasa disesuaikan:

| File | Fungsi |
| --- | --- |
| `src/app/invitation/invitation.ts` | Data tema, pasangan, acara, galeri, perjalanan, lokasi, dan perilaku halaman |
| `src/app/invitation/invitation.html` | Struktur serta tampilan halaman undangan |
| `src/app/theme-catalog/theme-catalog.ts` | Daftar tema pada halaman katalog |
| `src/app/invitation-access.ts` | Daftar pelanggan dan masa berlaku undangan |
| `src/app/app.routes.ts` | Konfigurasi URL aplikasi |
| `src/styles.css` | Style global dan konfigurasi Tailwind CSS |
| `public/assets` | Gambar, ilustrasi, favicon, dan kode QR |

Saat mengganti lokasi acara, perbarui `locationUrl` di `invitation.ts` dan ganti `public/assets/qr-lokasi-undangan.png` agar keduanya mengarah ke lokasi yang sama.

## Perintah npm

| Perintah | Fungsi |
| --- | --- |
| `npm start` | Menjalankan development server |
| `npm run build` | Membuat production build |
| `npm run watch` | Build mode development dan memantau perubahan |
| `npm test` | Menjalankan unit test |

## Production build

```bash
npm run build
```

Hasil build berada di:

```text
dist/undangan-app/browser
```

Folder tersebut dapat diunggah ke layanan hosting statis seperti Netlify, Vercel, GitHub Pages, atau web hosting biasa. Karena aplikasi menggunakan Angular Router, hosting perlu diarahkan untuk mengembalikan `index.html` ketika pengguna membuka URL undangan secara langsung.

## Struktur proyek

```text
public/
  assets/                         Aset gambar dan ilustrasi
src/
  app/
    customer-invitation-page/     Validasi halaman pelanggan
    invitation/                   Halaman utama undangan
    theme-catalog/                Katalog tema
    unavailable-page/             Halaman fallback
    app.routes.ts                 Daftar rute
    invitation-access.ts          Data akses pelanggan
  index.html
  main.ts
  styles.css
```

## Menyimpan perubahan ke GitHub

```bash
git add .
git commit -m "docs: lengkapi dokumentasi proyek"
git push
```

## Catatan privasi

Aplikasi tidak mengirimkan nama tamu ke server. Nama yang dimasukkan pada sampul hanya digunakan untuk personalisasi tampilan dan disimpan secara lokal di browser pengguna.
