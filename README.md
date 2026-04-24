# Aplikasi CRUD Kontak - Firebase Realtime Database + Authentication

Proyek ini adalah aplikasi web sederhana untuk demonstrasi **BaaS menggunakan Firebase** dengan:
- **Firebase Authentication** (Register, Login, Logout)
- **Firebase Realtime Database** (CRUD kontak)

## Fitur
- Register akun (email + password)
- Login & logout
- Create: tambah data kontak baru
- Read: tampilkan seluruh data kontak secara realtime
- Update: ubah data kontak yang sudah ada
- Delete: hapus data kontak
- Data kontak disimpan per user login (`users/{uid}/contacts`)

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
- Firebase Authentication (Web SDK v12.12.1)
- Firebase Realtime Database (Web SDK v12.12.1)
- Firebase Analytics (Web SDK v12.12.1)

## Konfigurasi Firebase
Konfigurasi Firebase dipisah ke file `firebase-config.js`.

> Jika ingin mengganti project, ubah nilai `firebaseConfig` di `firebase-config.js`.

## Cara Menjalankan Lokal
1. Aktifkan **Authentication** (Email/Password) pada project Firebase.
2. Aktifkan **Realtime Database**.
3. Atur aturan database untuk pengujian. Contoh sederhana berbasis user:

   ```json
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "auth != null && auth.uid === $uid",
           ".write": "auth != null && auth.uid === $uid"
         }
       }
     }
   }
   ```

4. Jalankan web server lokal, misalnya:

   ```bash
   python3 -m http.server 5500
   ```

5. Buka browser ke `http://localhost:5500`.

## Deploy ke Firebase Hosting
File konfigurasi hosting sudah ditambahkan:
- `.firebaserc`
- `.firebaseignore`
- `firebase.json` dengan target hosting `web-for-tugas`

Gunakan langkah berikut:

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only hosting:web-for-tugas
```

Saat `firebase init`, gunakan site hosting: **`web-for-tugas`**.

## Struktur File
- `index.html` → UI auth + form CRUD + tabel data.
- `firebase-config.js` → inisialisasi Firebase app/auth/db/analytics.
- `styles.css` → styling tambahan.
- `app.js` → logika Firebase Authentication + Realtime Database.
- `.firebaserc` + `firebase.json` → konfigurasi Firebase Hosting.
