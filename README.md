# Statistik Indonesia — National Statistics Site

Situs statistik nasional Indonesia dengan angka resmi **BPS (Badan Pusat Statistik) 2024**:
penduduk, ekonomi, ketenagakerjaan, kemiskinan, plus dua kalkulator interaktif.
Dibangun untuk bounty [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539) di make.fun.

## Isi situs

- **Dashboard** — 8 kartu indikator utama (penduduk, PDB, pertumbuhan, inflasi,
  pengangguran, kemiskinan, IPM, Gini) + grafik tren ekonomi dan kemiskinan.
- **Penduduk** — 281,6 juta jiwa, struktur umur, komposisi jenis kelamin, dan tabel
  10 provinsi terbanyak yang bisa dicari dan diurutkan.
- **Ekonomi** — PDB Rp22.139 triliun, pertumbuhan 5,03%, struktur PDB per lapangan usaha,
  perdagangan luar negeri, dan grafik tren yang bisa diganti (pertumbuhan / inflasi).
- **Ketenagakerjaan** — angkatan kerja 152,37 juta, TPT 4,91%, formal vs informal,
  pekerja per sektor (jumlah / persentase), dan UMP 2025.
- **Kemiskinan** — 8,57% (24,06 juta jiwa, Sep 2024), tren 2020–2024, kota vs desa,
  indeks kedalaman dan keparahan kemiskinan.
- **Kalkulator** — kalkulator inflasi (nilai uang 2019–2023 dalam harga 2024, memakai
  IHK BPS) dan kalkulator proyeksi PDB (pertumbuhan majemuk).

Semua angka konsisten satu sama lain (total = jumlah komponen, persentase berjumlah 100)
dan dirujuk dari publikasi BPS 2024 serta Bank Dunia. Tidak ada placeholder, tidak ada
panggilan jaringan: grafik digambar sebagai SVG dari data lokal.

## Menjalankan lokal

```sh
cd app
python3 -m http.server 8080
# buka http://localhost:8080/
```

## Struktur repo

```
main.ts                  # program entri: salin app/ + screenshots/ ke /output, tulis dossier.json
app/                     # situs statis (index.html, style.css, data.js, app.js)
screenshots/             # 4 render asli situs (desktop + ponsel)
vendor/makefun-frontend.ts  # pustaka dossier dari kit (tidak diubah)
```

## Screenshot

1. `1-dashboard.jpg` — Dashboard (sampul)
2. `2-penduduk.jpg` — halaman Penduduk
3. `3-kalkulator.jpg` — halaman Kalkulator
4. `4-dashboard-phone.jpg` — Dashboard ukuran ponsel
