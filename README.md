# Employee Management (HR Nexus)

Ini adalah mini project dengan domain Employee Management. Dibuat dengan menggunakan **Angular 17** dan **Tailwind CSS**. Mengimplementasikan _Responsive Web Design_ dengan rancangan arsitektur _clean code_ (Standalone Components & Signals state management).

## Fitur Utama Sesuai Spesifikasi:
1. **Login Page:** Dilengkapi fungsi dan validasi login.
2. **Employee List Page:** Menampilkan lebih dari 100 _dummy data_ lengkap dengan fitur pencarian (AND parameter: Username dan Group), sorting, pagination, add employee, serta aksi tabel edit (notifikasi kuning) dan delete (notifikasi merah).
3. **Add Employee Page:** Validasi mandatory untuk seluruh atribut form, kalender yang tidak bisa di-set lebih dari tanggal hari ini untuk _birth date_, field berformat _number_ untuk gaji, serta list group menggunakan _dropdown search_.
4. **Employee Detail Page:** Menampilkan detail data karyawan dengan _formatting_ rupiah (`Rp. xx.xxx,xx`), serta tombol kembali yang menjaga riwayat pencarian (state/search sebelumnya tidak hilang).

## Spesifikasi Environment
- **Node.js:** Versi 18 atau ke atas yang disarankan (Direkomendasikan v18.19.1 LTS atau v20).
- **Angular CLI:** Versi 17.3.x (`npm install -g @angular/cli@17`)
- **Package Manager:** npm (terinstall bersama Node.js)

## Cara Menjalankan Aplikasi Lokal

1. Buka terminal atau command prompt.
2. Lakukan clone repository ini dan arahkan ke dalam folder proyek.
   ```bash
   git clone <URL_REPO_ANDA>
   cd backoffice-apps
   ```
3. Install seluruh dependensi yang dibutuhkan:
   ```bash
   npm install
   ```
4. Jalankan _development server_:
   ```bash
   ng serve
   ```
   Atau bisa juga dengan:
   ```bash
   npm start
   ```
5. Buka browser dan kunjungi `http://localhost:4200/`. Aplikasi akan otomatis _reload_ jika Anda melakukan perubahan pada *source code*.

## Build untuk Production
Gunakan command berikut untuk me-_compile_ project dan folder *build* akan tersedia di `/dist`:
```bash
ng build
```
