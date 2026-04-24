# Aplikasi CRUD Kontak - Firebase Realtime Database

Proyek ini adalah aplikasi web sederhana untuk demonstrasi **BaaS menggunakan Firebase Realtime Database**.

## Fitur
- Create: tambah data kontak baru.
- Read: tampilkan seluruh data kontak secara realtime.
- Update: ubah data kontak yang sudah ada.
- Delete: hapus data kontak.

## Data yang disimpan (5 field)
1. `name`
2. `email`
3. `phone`
4. `city`
5. `note`

Tambahan metadata:
- `createdAt`
- `updatedAt`

## Teknologi
- HTML5
- CSS3
- Bootstrap 5
- Firebase Realtime Database (Web SDK)

## Cara Menjalankan
1. Buat project Firebase di [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Realtime Database**.
3. Salin konfigurasi web Firebase Anda.
4. Buka file `app.js`, lalu ganti objek `firebaseConfig` dengan konfigurasi project Anda.
5. Jalankan dengan web server lokal sederhana, misalnya:

   ```bash
   python3 -m http.server 5500
   ```

6. Buka browser ke `http://localhost:5500`.

## Struktur File
- `index.html` → UI form dan tabel data.
- `styles.css` → styling tambahan.
- `app.js` → logika Firebase CRUD.
