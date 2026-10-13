# Membuat tautan undangan dari Google Sheets

Undangan Reza & Fitri membaca nama tamu dari bagian `#to=` pada tautan. Bagian ini dibaca oleh browser setelah halaman terbuka. Tautan dibuat dengan `?v=2` yang sebelumnya sudah menampilkan kartu WhatsApp, sehingga pratinjau mengambil halaman yang sama untuk setiap tamu. Google Sheets dapat dipakai untuk membuat satu tautan per tamu tanpa perlu memasukkan nama satu per satu ke kode.

**Penting:** Formula `#to=` di bawah baru mengisi nama setelah perubahan kode ini di-deploy ke Vercel. Pada versi Vercel sebelumnya, gunakan `?v=2&to=`; misalnya `https://weding-sage.vercel.app/undangan/kebun-senja/reza-fitri?v=2&to=Budi`.

1. Buka [Google Sheets baru](https://sheets.google.com/create).
2. Klik kotak `A1`, ketik `Nama Tamu`, lalu tekan Enter. Klik kotak `B1`, ketik `Tautan Undangan`, lalu tekan Enter.
3. Klik kotak `A2`, ketik satu nama, misalnya `Bapak Ahmad`, lalu tekan Enter. Nama harus memiliki sedikitnya tiga huruf dan tidak mengandung angka.
4. Klik kotak `B2`, tempel rumus ini, lalu tekan Enter:

   ```gs
   ="https://weding-sage.vercel.app/undangan/kebun-senja/reza-fitri?v=2#to="&ENCODEURL(TRIM(A2))
   ```

5. Tautan akan muncul di `B2`. Klik tautan itu untuk mencoba; sampul undangan akan menampilkan `Bapak Ahmad`.
6. Untuk tamu berikutnya, isi namanya di `A3`, lalu salin isi `B2` dan tempel ke `B3`. Ulangi untuk baris berikutnya. Kirim tautan dari kolom B kepada masing-masing tamu.

Contoh: `Bapak Ahmad` menghasilkan `https://weding-sage.vercel.app/undangan/kebun-senja/reza-fitri?v=2#to=Bapak%20Ahmad`. `ENCODEURL` mengubah spasi dan karakter khusus agar aman dipakai dalam alamat web. Tautan lama dengan `?to=` masih dapat mengisi nama, tetapi gunakan format `?v=2#to=` untuk tautan baru yang dibagikan melalui WhatsApp.

Jika undangan dipublikasikan di domain lain, ganti bagian `https://weding-sage.vercel.app` pada rumus. Pastikan versi kode terbaru sudah di-deploy sebelum mencoba tautan `#to=`. Spreadsheet ini **membuat tautan**, bukan sumber data yang dibaca undangan secara langsung: perubahan nama di Sheets setelah tautan dikirim tidak mengubah tautan yang sudah diterima tamu.
