# Aplikasi CRUD Kontak - Firebase Realtime Database + Authentication

Proyek ini adalah aplikasi web sederhana untuk demonstrasi **BaaS menggunakan Firebase** dengan:
- **Firebase Authentication** (Sign In/Register, Login, Logout)
- **Firebase Realtime Database** (CRUD kontak)

## Struktur Halaman (Dipisah)
1. `signin.html` → halaman daftar akun (sign in/register)
2. `login.html` → halaman login
3. `form-kontak.html` → halaman form tambah/update kontak
4. `daftar-kontak.html` → halaman tabel daftar kontak

## Fitur
- Register akun (email + password)
- Login & logout
- Create, Read, Update, Delete data kontak
- Data tersimpan per user di path `users/{uid}/contacts`
- 5 field data utama: `name`, `email`, `phone`, `city`, `note`

## Konfigurasi Firebase
- `firebase-config.js` berisi konfigurasi dan inisialisasi Firebase App, Auth, Database, dan Analytics.

## Cara Menjalankan Lokal
1. Aktifkan **Authentication** (Email/Password) pada Firebase Console.
2. Aktifkan **Realtime Database**.
3. Atur rules database (contoh):

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

4. Jalankan server lokal:

   ```bash
   python3 -m http.server 5500
   ```

5. Buka `http://localhost:5500` (otomatis redirect ke `signin.html`).

## Deploy ke Firebase Hosting
Konfigurasi hosting sudah disiapkan untuk target `web-for-tugas`.

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only hosting:web-for-tugas
```

## File Utama
- `signin.html`, `login.html`, `form-kontak.html`, `daftar-kontak.html`
- `register.js`, `login.js`, `contact-form.js`, `contact-list.js`, `auth-utils.js`
- `firebase-config.js`
- `.firebaserc`, `firebase.json`, `.firebaseignore`
