// Data Statistik Indonesia — angka resmi BPS (Badan Pusat Statistik) 2024,
// kecuali dinyatakan lain. Semua angka dalam file ini saling konsisten:
// total penduduk = jumlah provinsi + sisa, persentase berjumlah 100,
// dan tren tahunan memakai seri yang sama dari publikasi BPS.
export const DATA = {
  meta: {
    country: "Indonesia",
    year: 2024,
    sources: ["BPS — Badan Pusat Statistik", "Bank Dunia (World Bank)"],
    updated: "November 2026",
  },

  // ---- Ringkasan utama (dipakai kartu KPI di Dashboard) ----
  kpi: [
    { id: "penduduk", label: "Jumlah Penduduk", value: "281,6 jt", note: "jiwa, 2024", change: "+0,82% dari 2023", up: true },
    { id: "pdb", label: "PDB Nominal", value: "Rp22.139 T", note: "triliun rupiah, 2024", change: "US$1,4 triliun", up: true },
    { id: "tumbuh", label: "Pertumbuhan Ekonomi", value: "5,03%", note: "y-on-y, 2024", change: "Q4 2024: 5,02%", up: true },
    { id: "inflasi", label: "Inflasi Tahunan", value: "1,57%", note: "Des 2024 (y-on-y)", change: "di bawah sasaran 2,5% ±1%", up: true },
    { id: "tpt", label: "Pengangguran Terbuka", value: "4,91%", note: "Agustus 2024", change: "turun dari 5,32% (2023)", up: true },
    { id: "miskin", label: "Penduduk Miskin", value: "8,57%", note: "September 2024", change: "24,06 juta jiwa", up: true },
    { id: "ipm", label: "Indeks Pembangunan Manusia", value: "75,02", note: "2024, kategori tinggi", change: "naik 0,63 poin", up: true },
    { id: "gini", label: "Rasio Gini", value: "0,379", note: "Maret 2024", change: "turun dari 0,388", up: true },
  ],

  // ---- Penduduk ----
  population: {
    total: 281.6, // juta jiwa, 2024
    growth: 0.82, // % per tahun
    density: 148, // jiwa per km2
    sexRatio: 100.7, // laki-laki per 100 perempuan
    medianAge: 31.1,
    ageGroups: [
      { label: "0–14 tahun", pct: 24.1, color: "#2f6fb2" },
      { label: "15–64 tahun", pct: 68.6, color: "#0b5cad" },
      { label: "65+ tahun", pct: 7.3, color: "#7fb3d5" },
    ],
    // 10 provinsi berpenduduk terbanyak, juta jiwa, BPS 2024
    provinces: [
      { name: "Jawa Barat", pop: 49.9, density: 1335 },
      { name: "Jawa Timur", pop: 41.8, density: 872 },
      { name: "Jawa Tengah", pop: 37.9, density: 1092 },
      { name: "Sumatera Utara", pop: 15.6, density: 214 },
      { name: "Banten", pop: 12.4, density: 1287 },
      { name: "DKI Jakarta", pop: 10.6, density: 15906 },
      { name: "Sulawesi Selatan", pop: 9.4, density: 201 },
      { name: "Lampung", pop: 9.1, density: 264 },
      { name: "Sumatera Selatan", pop: 8.8, density: 96 },
      { name: "Riau", pop: 6.6, density: 76 },
    ],
    provincesNote: "Sepuluh provinsi di atas menampung 202,1 juta jiwa (71,8% penduduk). Sisanya 79,5 juta jiwa tersebar di 28 provinsi lain.",
  },

  // ---- Ekonomi ----
  economy: {
    gdpNominal: 22139, // Rp triliun, 2024
    gdpPerCapita: 78.6, // Rp juta, 2024
    gdpPerCapitaUsd: 4800, // US$ (sekitar), 2024
    growth: [
      { year: 2020, value: -2.07 },
      { year: 2021, value: 3.70 },
      { year: 2022, value: 5.31 },
      { year: 2023, value: 5.05 },
      { year: 2024, value: 5.03 },
    ],
    growthQuarterly2024: [
      { label: "Q1 2024", value: 5.11 },
      { label: "Q2 2024", value: 5.05 },
      { label: "Q3 2024", value: 4.95 },
      { label: "Q4 2024", value: 5.02 },
    ],
    inflation: [
      { year: 2020, value: 1.68 },
      { year: 2021, value: 1.87 },
      { year: 2022, value: 5.51 },
      { year: 2023, value: 2.61 },
      { year: 2024, value: 1.57 },
    ],
    // Indeks harga konsumen (2019 = 100), dihitung dari inflasi tahunan di atas
    cpi: { 2019: 100.0, 2020: 101.68, 2021: 103.58, 2022: 109.29, 2023: 112.14, 2024: 113.9 },
    sectors: [
      { label: "Industri Pengolahan", pct: 18.67 },
      { label: "Perdagangan", pct: 12.84 },
      { label: "Pertanian, Kehutanan, Perikanan", pct: 12.53 },
      { label: "Konstruksi", pct: 10.02 },
      { label: "Pertambangan dan Penggalian", pct: 9.78 },
      { label: "Transportasi dan Pergudangan", pct: 6.36 },
      { label: "Lapangan usaha lainnya", pct: 29.8 },
    ],
    trade: {
      exportUsd: 264.7, // miliar US$, 2024
      importUsd: 233.7, // miliar US$, 2024
      surplusUsd: 31.0, // miliar US$, 2024
      reservesUsd: 155.7, // miliar US$, Desember 2024
    },
  },

  // ---- Ketenagakerjaan ----
  labour: {
    workforce: 152.37, // juta, Agustus 2024
    employed: 144.64, // juta, Agustus 2024
    unemployed: 7.73, // juta, Agustus 2024
    tpt: 4.91, // %, Agustus 2024
    tptTrend: [
      { year: 2020, value: 7.07 },
      { year: 2021, value: 6.49 },
      { year: 2022, value: 5.86 },
      { year: 2023, value: 5.32 },
      { year: 2024, value: 4.91 },
    ],
    formal: { count: 58.1, pct: 40.1 },
    informal: { count: 86.6, pct: 59.9 },
    bySector: [
      { label: "Pertanian", pct: 28.3 },
      { label: "Perdagangan", pct: 19.1 },
      { label: "Industri Pengolahan", pct: 13.8 },
      { label: "Jasa Kemasyarakatan", pct: 8.2 },
      { label: "Sektor lainnya", pct: 30.6 },
    ],
    ump: {
      highest: { province: "DKI Jakarta", value: 5396761 },
      lowest: { province: "Jawa Tengah", value: 2169349 },
      year: 2025,
    },
  },

  // ---- Kemiskinan ----
  poverty: {
    rateSep2024: 8.57,
    countSep2024: 24.06, // juta jiwa
    rateMar2024: 9.03,
    povertyLine: 595242, // Rp per kapita per bulan, September 2024
    urban: 7.09,
    rural: 11.34,
    depthIndex: 1.46, // P1, September 2024
    severityIndex: 0.35, // P2, September 2024
    trend: [
      { year: 2020, value: 10.19 },
      { year: 2021, value: 9.71 },
      { year: 2022, value: 9.57 },
      { year: 2023, value: 9.36 },
      { year: 2024, value: 8.57 },
    ],
  },
};

// Format angka Indonesia: titik ribuan, koma desimal.
export function fmtID(n, decimals = 0) {
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtRp(n) {
  return "Rp" + n.toLocaleString("id-ID");
}
