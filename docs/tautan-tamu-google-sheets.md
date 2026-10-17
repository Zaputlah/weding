# Membuat tautan undangan dari Google Sheets

Gunakan tautan berbagi di bawah agar kartu WhatsApp menampilkan gambar amplop Kebun Senja beserta nama tamu. Saat tamu mengetuknya, tautan membuka undangan Reza & Fitri dengan nama yang sudah terisi. Google Sheets hanya membuat tautan per tamu; daftar nama tidak dibaca langsung oleh situs.

**Penting:** Tautan berbagi ini baru berfungsi setelah kode terbaru di-deploy ke Vercel.

1. Buka [Google Sheets baru](https://sheets.google.com/create).
2. Klik kotak `A1`, ketik `Nama Tamu`, lalu tekan Enter. Klik kotak `B1`, ketik `Tautan Undangan`, lalu tekan Enter.
3. Klik kotak `A2`, ketik satu nama, misalnya `Bapak Ahmad`, lalu tekan Enter. Nama harus memiliki sedikitnya tiga huruf dan tidak mengandung angka.
4. Klik kotak `B2`, tempel rumus ini, lalu tekan Enter:

   ```gs
   ="https://weding-sage.vercel.app/api/share?to="&ENCODEURL(TRIM(A2))
   ```

5. Tautan akan muncul di `B2`. Klik tautan itu untuk mencoba; sampul undangan akan menampilkan `Bapak Ahmad`.
6. Untuk tamu berikutnya, isi namanya di `A3`, lalu salin isi `B2` dan tempel ke `B3`. Ulangi untuk baris berikutnya. Kirim tautan dari kolom B kepada masing-masing tamu.

Contoh: `Bapak Ahmad` menghasilkan `https://weding-sage.vercel.app/api/share?to=Bapak%20Ahmad`. `ENCODEURL` mengubah spasi dan karakter khusus agar aman dipakai dalam alamat web. Tautan langsung dengan `?to=` atau `#to=` tetap membuka undangan bernama, tetapi kartu WhatsApp-nya tidak menampilkan amplop dengan nama khusus.

Jika nama tamu mengandung `&`, misalnya `Ka Riri & Keluarga`, rumus di atas otomatis mengubahnya menjadi `%26`. Saat menulis tautan sendiri, gunakan `Ka%20Riri%20%26%20Keluarga` setelah `to=` agar nama tidak terpotong.

Nama yang sudah ada di tautan ditampilkan sebagai teks pada sampul sehingga tamu tidak bisa mengeditnya di kolom undangan. Tautannya sendiri masih dapat diubah atau dibuat ulang; nama dari tautan bukan verifikasi identitas tamu.

Jika undangan dipublikasikan di domain lain, ganti bagian `https://weding-sage.vercel.app` pada rumus. Perubahan nama di Sheets setelah tautan dikirim tidak mengubah tautan yang sudah diterima tamu.
