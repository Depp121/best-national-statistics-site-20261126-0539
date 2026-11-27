// Statistik Indonesia — logika tampilan (hash routing + grafik SVG + kalkulator).
// Semua angka berasal dari data.js (BPS 2024). Tidak ada panggilan jaringan.
import { DATA, fmtID, fmtRp } from "./data.js";

const root = document.getElementById("app");
const navLinks = [...document.querySelectorAll("[data-route]")];

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- Pembuat grafik SVG ----------

function hbars(rows, maxValue, unit = "") {
  const max = maxValue || Math.max(...rows.map((r) => r.value));
  return rows
    .map(
      (r) => `
    <div class="bar-row">
      <span class="bar-label">${esc(r.label)}</span>
      <span class="bar-track"><span class="bar-fill ${r.tone || ""}" style="display:block;width:${Math.max(
        1.5,
        (r.value / max) * 100
      ).toFixed(1)}%"></span></span>
      <span class="bar-value">${fmtID(r.value, r.decimals ?? 2)}${unit}</span>
    </div>`
    )
    .join("");
}

function lineChart(points, opts = {}) {
  const W = 640, H = 220, PL = 44, PR = 14, PT = 16, PB = 28;
  const xs = points.map((_, i) => PL + (i * (W - PL - PR)) / Math.max(1, points.length - 1));
  const vals = points.map((p) => p.value);
  const lo = Math.min(0, ...vals), hi = Math.max(...vals);
  const span = hi - lo || 1;
  const y = (v) => PT + (1 - (v - lo) / span) * (H - PT - PB);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const dots = points
    .map((p, i) => {
      const lx = Math.min(Math.max(xs[i], 34), W - 34);
      return `<circle cx="${xs[i]}" cy="${y(p.value)}" r="4.5" fill="#0b5cad" stroke="#fff" stroke-width="1.5"/>
      <text x="${lx}" y="${y(p.value) - 10}" text-anchor="middle" font-size="12" font-weight="700" fill="#0b2e59">${fmtID(
        p.value,
        opts.decimals ?? 2
      )}%</text>
      <text x="${xs[i]}" y="${H - 8}" text-anchor="middle" font-size="12" fill="#5b6b82">${esc(p.label)}</text>`;
    })
    .join("");
  const zeroY = y(0);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Grafik garis ${esc(
    opts.title || ""
  )}">
    <line x1="${PL}" y1="${zeroY}" x2="${W - PR}" y2="${zeroY}" stroke="#dbe3ee" stroke-width="1"/>
    <path d="${path}" fill="none" stroke="#0b5cad" stroke-width="2.5" stroke-linejoin="round"/>
    ${dots}
  </svg>`;
}

// ---------- Halaman: Dashboard ----------

function pageDashboard() {
  const kpiCards = DATA.kpi
    .map(
      (k) => `
    <a class="kpi" href="#/${k.id === "penduduk" ? "penduduk" : k.id === "pdb" || k.id === "tumbuh" || k.id === "inflasi" ? "ekonomi" : k.id === "tpt" ? "kerja" : k.id === "miskin" ? "kemiskinan" : k.id === "ipm" || k.id === "gini" ? "kemiskinan" : ""}">
      <div class="kpi-label">${esc(k.label)}</div>
      <div class="kpi-value">${esc(k.value)}</div>
      <div class="kpi-note">${esc(k.note)}</div>
      <div class="kpi-change">${esc(k.change)}</div>
    </a>`
    )
    .join("");

  return `
  <h2 class="page-title">Dashboard Statistik Nasional</h2>
  <p class="lede">Gambaran ringkas kondisi Indonesia tahun 2024 berdasarkan publikasi resmi BPS.
  Klik kartu mana pun untuk melihat halaman detailnya.</p>
  <div class="grid-kpi">${kpiCards}</div>
  <div class="grid-2">
    <section class="card">
      <h3>Pertumbuhan Ekonomi 2020–2024</h3>
      ${lineChart(DATA.economy.growth.map((g) => ({ label: String(g.year), value: g.value })), { title: "Pertumbuhan ekonomi" })}
      <p class="muted small">PDB tumbuh 5,03% pada 2024, ditopang konsumsi rumah tangga dan investasi.</p>
    </section>
    <section class="card">
      <h3>Tingkat Kemiskinan 2020–2024</h3>
      ${lineChart(DATA.poverty.trend.map((t) => ({ label: String(t.year), value: t.value })), { title: "Tingkat kemiskinan" })}
      <p class="muted small">September 2024: 8,57% atau 24,06 juta jiwa — terendah dalam satu dekade terakhir.</p>
    </section>
  </div>
  <div class="callout"><strong>Catatan:</strong> semua angka di situs ini memakai tahun acuan 2024 dan dirujuk dari
  publikasi BPS. Halaman Kalkulator memakai tabel inflasi resmi yang sama.</div>`;
}

// ---------- Halaman: Penduduk ----------

let provQuery = "";
let provSort = "pop"; // pop | name
let provDir = -1; // -1 = terbesar dulu

function pagePenduduk() {
  const p = DATA.population;
  const ageBars = hbars(
    p.ageGroups.map((a) => ({ label: a.label, value: a.pct, decimals: 1 })),
    100,
    "%"
  );
  return `
  <h2 class="page-title">Penduduk</h2>
  <p class="lede">Indonesia dihuni ${fmtID(p.total, 1)} juta jiwa pada 2024 — negara berpenduduk terbesar keempat di dunia.
  Pulau Jawa menampung lebih dari separuh penduduk di kurang dari 7% luas daratan.</p>
  <div class="stat-row" style="margin-bottom:18px">
    <div class="stat-box"><div class="v">${fmtID(p.total, 1)} jt</div><div class="l">Jumlah penduduk 2024</div></div>
    <div class="stat-box"><div class="v">${fmtID(p.density)} jiwa/km&sup2;</div><div class="l">Kepadatan penduduk</div></div>
    <div class="stat-box"><div class="v">${fmtID(p.medianAge, 1)} thn</div><div class="l">Usia median (penduduk muda)</div></div>
  </div>
  <div class="grid-2">
    <section class="card">
      <h3>Struktur Umur 2024</h3>
      ${ageBars}
      <p class="muted small">68,6% penduduk berada pada usia produktif (15–64 tahun) — jendela bonus demografi.</p>
    </section>
    <section class="card">
      <h3>Komposisi Jenis Kelamin</h3>
      ${hbars(
        [
          { label: "Laki-laki", value: 50.2, decimals: 1 },
          { label: "Perempuan", value: 49.8, decimals: 1 },
        ],
        100,
        "%"
      )}
      <p class="muted small">Rasio jenis kelamin ${fmtID(p.sexRatio, 1)} — ada ${fmtID(p.sexRatio, 1)} laki-laki untuk setiap 100 perempuan.</p>
    </section>
  </div>
  <section class="card">
    <h3>10 Provinsi Berpenduduk Terbanyak</h3>
    <div class="toolbar">
      <input type="search" id="prov-search" placeholder="Cari provinsi…" value="${esc(provQuery)}" aria-label="Cari provinsi">
      <span class="muted small" id="prov-count"></span>
    </div>
    <div style="overflow-x:auto">
    <table class="data" id="prov-table">
      <thead><tr>
        <th><button data-sort="name">Provinsi &#8597;</button></th>
        <th class="num"><button data-sort="pop">Penduduk (juta) &#8597;</button></th>
        <th class="num">Kepadatan (jiwa/km&sup2;)</th>
        <th class="num">Pangsa Nasional</th>
      </tr></thead>
      <tbody id="prov-body"></tbody>
    </table>
    </div>
    <p class="muted small">${esc(p.provincesNote)}</p>
  </section>`;
}

function renderProvTable() {
  const body = document.getElementById("prov-body");
  const count = document.getElementById("prov-count");
  if (!body) return;
  let rows = DATA.population.provinces.filter((r) =>
    r.name.toLowerCase().includes(provQuery.trim().toLowerCase())
  );
  rows = [...rows].sort((a, b) =>
    provSort === "name"
      ? provDir * a.name.localeCompare(b.name, "id")
      : provDir * (a.pop - b.pop)
  );
  body.innerHTML =
    rows
      .map(
        (r) => `<tr>
      <td>${esc(r.name)}</td>
      <td class="num">${fmtID(r.pop, 1)}</td>
      <td class="num">${fmtID(r.density)}</td>
      <td class="num">${fmtID((r.pop / DATA.population.total) * 100, 1)}%</td>
    </tr>`
      )
      .join("") ||
    `<tr><td colspan="4" class="center muted">Tidak ada provinsi yang cocok dengan “${esc(provQuery)}”.</td></tr>`;
  if (count) count.textContent = `${rows.length} dari 10 provinsi ditampilkan`;
}

// ---------- Halaman: Ekonomi ----------

let ecoMode = "growth"; // growth | inflation

function pageEkonomi() {
  const e = DATA.economy;
  return `
  <h2 class="page-title">Ekonomi</h2>
  <p class="lede">PDB Indonesia 2024 mencapai Rp22.139 triliun (sekitar US$1,4 triliun) dengan pertumbuhan 5,03%.
  Inflasi terkendali di 1,57% dan neraca perdagangan surplus US$31,0 miliar.</p>
  <div class="stat-row" style="margin-bottom:18px">
    <div class="stat-box"><div class="v">Rp${fmtID(e.gdpNominal)} T</div><div class="l">PDB nominal 2024</div></div>
    <div class="stat-box"><div class="v">Rp${fmtID(e.gdpPerCapita, 1)} jt</div><div class="l">PDB per kapita 2024</div></div>
    <div class="stat-box"><div class="v">US$${fmtID(e.trade.surplusUsd, 1)} M</div><div class="l">Surplus perdagangan 2024</div></div>
  </div>
  <section class="card">
    <h3>Tren Tahunan — pilih indikator</h3>
    <div class="toolbar">
      <div class="seg" role="group" aria-label="Pilih indikator">
        <button id="seg-growth" aria-pressed="${ecoMode === "growth"}">Pertumbuhan PDB</button>
        <button id="seg-inflation" aria-pressed="${ecoMode === "inflation"}">Inflasi</button>
      </div>
      <span class="muted small" id="eco-caption"></span>
    </div>
    <div id="eco-chart"></div>
  </section>
  <div class="grid-2">
    <section class="card">
      <h3>Struktur PDB menurut Lapangan Usaha 2024</h3>
      ${hbars(e.sectors.map((s) => ({ label: s.label, value: s.pct, decimals: 2 })), 100, "%")}
      <p class="muted small">Industri pengolahan tetap menjadi penyumbang terbesar PDB, diikuti perdagangan dan pertanian.</p>
    </section>
    <section class="card">
      <h3>Pertumbuhan per Triwulan 2024</h3>
      ${hbars(e.growthQuarterly2024.map((q) => ({ label: q.label, value: q.value, decimals: 2, tone: "green" })), 6, "%")}
      <h3 style="margin-top:20px">Perdagangan Luar Negeri 2024</h3>
      <table class="data">
        <tbody>
          <tr><td>Ekspor</td><td class="num">US$${fmtID(e.trade.exportUsd, 1)} miliar</td></tr>
          <tr><td>Impor</td><td class="num">US$${fmtID(e.trade.importUsd, 1)} miliar</td></tr>
          <tr><td>Surplus</td><td class="num">US$${fmtID(e.trade.surplusUsd, 1)} miliar</td></tr>
          <tr><td>Cadangan devisa (Des 2024)</td><td class="num">US$${fmtID(e.trade.reservesUsd, 1)} miliar</td></tr>
        </tbody>
      </table>
    </section>
  </div>`;
}

function renderEcoChart() {
  const chart = document.getElementById("eco-chart");
  const cap = document.getElementById("eco-caption");
  const segG = document.getElementById("seg-growth");
  const segI = document.getElementById("seg-inflation");
  if (!chart) return;
  if (ecoMode === "growth") {
    chart.innerHTML = lineChart(
      DATA.economy.growth.map((g) => ({ label: String(g.year), value: g.value })),
      { title: "Pertumbuhan PDB" }
    );
    if (cap) cap.textContent = "Tumbuh stabil di atas 5% selama 2022–2024 setelah kontraksi 2020.";
  } else {
    chart.innerHTML = lineChart(
      DATA.economy.inflation.map((g) => ({ label: String(g.year), value: g.value })),
      { title: "Inflasi tahunan" }
    );
    if (cap) cap.textContent = "Inflasi 2022 melonjak ke 5,51% lalu kembali turun ke 1,57% pada 2024.";
  }
  if (segG) segG.setAttribute("aria-pressed", String(ecoMode === "growth"));
  if (segI) segI.setAttribute("aria-pressed", String(ecoMode === "inflation"));
}

// ---------- Halaman: Ketenagakerjaan ----------

let labourMode = "count"; // count | pct

function pageKerja() {
  const l = DATA.labour;
  return `
  <h2 class="page-title">Ketenagakerjaan</h2>
  <p class="lede">Dari 152,37 juta angkatan kerja (Agustus 2024), sebanyak 144,64 juta orang bekerja dan 7,73 juta
  menganggur. Tingkat pengangguran terbuka 4,91% — terendah sejak 2019.</p>
  <div class="stat-row" style="margin-bottom:18px">
    <div class="stat-box"><div class="v">${fmtID(l.workforce, 2)} jt</div><div class="l">Angkatan kerja</div></div>
    <div class="stat-box"><div class="v">${fmtID(l.employed, 2)} jt</div><div class="l">Penduduk bekerja</div></div>
    <div class="stat-box"><div class="v">${fmtID(l.tpt, 2)}%</div><div class="l">Pengangguran terbuka (TPT)</div></div>
  </div>
  <div class="grid-2">
    <section class="card">
      <h3>Tren Pengangguran Terbuka 2020–2024</h3>
      ${lineChart(l.tptTrend.map((t) => ({ label: String(t.year), value: t.value })), { title: "TPT" })}
      <p class="muted small">TPT turun setiap tahun sejak puncak pandemi 7,07% pada 2020.</p>
    </section>
    <section class="card">
      <h3>Pekerja Formal vs Informal</h3>
      ${hbars(
        [
          { label: "Formal", value: l.formal.pct, decimals: 1, tone: "green" },
          { label: "Informal", value: l.informal.pct, decimals: 1, tone: "gold" },
        ],
        100,
        "%"
      )}
      <p class="muted small">Formal: ${fmtID(l.formal.count, 1)} juta orang &middot; Informal: ${fmtID(
        l.informal.count,
        1
      )} juta orang. Pekerja informal masih mendominasi pasar kerja Indonesia.</p>
      <h3 style="margin-top:20px">Upah Minimum Provinsi ${l.ump.year}</h3>
      <table class="data">
        <tbody>
          <tr><td>Tertinggi — ${esc(l.ump.highest.province)}</td><td class="num">${fmtRp(l.ump.highest.value)}</td></tr>
          <tr><td>Terendah — ${esc(l.ump.lowest.province)}</td><td class="num">${fmtRp(l.ump.lowest.value)}</td></tr>
        </tbody>
      </table>
    </section>
  </div>
  <section class="card">
    <h3>Pekerja menurut Sektor</h3>
    <div class="toolbar">
      <div class="seg" role="group" aria-label="Tampilan sektor">
        <button id="seg-count" aria-pressed="${labourMode === "count"}">Jumlah (juta)</button>
        <button id="seg-pct" aria-pressed="${labourMode === "pct"}">Persentase</button>
      </div>
    </div>
    <div id="sector-chart"></div>
    <p class="muted small">Pertanian masih menyerap tenaga kerja terbanyak, diikuti perdagangan dan industri pengolahan.</p>
  </section>`;
}

function renderSectorChart() {
  const el = document.getElementById("sector-chart");
  const bC = document.getElementById("seg-count");
  const bP = document.getElementById("seg-pct");
  if (!el) return;
  const rows = DATA.labour.bySector.map((s) => ({
    label: s.label,
    value: labourMode === "count" ? (s.pct / 100) * DATA.labour.employed : s.pct,
    decimals: labourMode === "count" ? 1 : 1,
  }));
  const max = labourMode === "count" ? 50 : 100;
  el.innerHTML = hbars(rows, max, labourMode === "count" ? " jt" : "%");
  if (bC) bC.setAttribute("aria-pressed", String(labourMode === "count"));
  if (bP) bP.setAttribute("aria-pressed", String(labourMode === "pct"));
}

// ---------- Halaman: Kemiskinan ----------

function pageKemiskinan() {
  const pv = DATA.poverty;
  return `
  <h2 class="page-title">Kemiskinan</h2>
  <p class="lede">Pada September 2024, penduduk miskin Indonesia sebanyak 24,06 juta jiwa (8,57%) — turun 1,16 juta
  jiwa dibanding Maret 2024. Garis kemiskinan Rp595.242 per kapita per bulan.</p>
  <div class="stat-row" style="margin-bottom:18px">
    <div class="stat-box"><div class="v">${fmtID(pv.rateSep2024, 2)}%</div><div class="l">Penduduk miskin, Sep 2024</div></div>
    <div class="stat-box"><div class="v">${fmtID(pv.countSep2024, 2)} jt</div><div class="l">Jumlah penduduk miskin</div></div>
    <div class="stat-box"><div class="v">${fmtRp(pv.povertyLine)}</div><div class="l">Garis kemiskinan /kapita/bln</div></div>
  </div>
  <div class="grid-2">
    <section class="card">
      <h3>Tren Kemiskinan 2020–2024</h3>
      ${lineChart(pv.trend.map((t) => ({ label: String(t.year), value: t.value })), { title: "Tingkat kemiskinan" })}
      <p class="muted small">Penurunan konsisten sejak 2020; 2024 mencatat angka terendah dalam satu dekade.</p>
    </section>
    <section class="card">
      <h3>Kota vs Desa (September 2024)</h3>
      ${hbars(
        [
          { label: "Perkotaan", value: pv.urban, decimals: 2, tone: "green" },
          { label: "Perdesaan", value: pv.rural, decimals: 2, tone: "gold" },
        ],
        15,
        "%"
      )}
      <p class="muted small">Kemiskinan di desa (11,34%) jauh lebih tinggi daripada di kota (7,09%).</p>
      <h3 style="margin-top:20px">Kedalaman &amp; Keparahan</h3>
      <table class="data">
        <tbody>
          <tr><td>Indeks Kedalaman Kemiskinan (P1)</td><td class="num">${fmtID(pv.depthIndex, 2)}</td></tr>
          <tr><td>Indeks Keparahan Kemiskinan (P2)</td><td class="num">${fmtID(pv.severityIndex, 2)}</td></tr>
          <tr><td>Maret 2024 (pembanding)</td><td class="num">${fmtID(pv.rateMar2024, 2)}%</td></tr>
        </tbody>
      </table>
    </section>
  </div>
  <div class="callout"><strong>Apa artinya?</strong> P1 mengukur seberapa jauh rata-rata pengeluaran penduduk miskin
  berada di bawah garis kemiskinan; P2 mengukur ketimpangan di antara mereka. Keduanya membaik sepanjang 2024.</div>`;
}

// ---------- Halaman: Kalkulator ----------

function pageKalkulator() {
  const years = Object.keys(DATA.economy.cpi).map(Number).sort((a, b) => a - b);
  const opts = years
    .filter((y) => y < 2024)
    .map((y) => `<option value="${y}">${y}</option>`)
    .join("");
  return `
  <h2 class="page-title">Kalkulator</h2>
  <p class="lede">Dua alat hitung interaktif memakai data resmi yang sama dengan halaman lain di situs ini.
  Semua perhitungan berjalan di peramban Anda.</p>
  <div class="grid-2">
    <section class="card">
      <h3>Kalkulator Inflasi — Nilai Uang dari Masa ke Masa</h3>
      <p class="muted small">Berapa nilai uang tahun lalu jika diukur dengan harga 2024? Memakai indeks harga
      konsumen (IHK) BPS: 2019 = 100.</p>
      <label class="small" for="inf-amount"><strong>Jumlah uang (Rp)</strong></label><br>
      <input type="number" id="inf-amount" min="1" step="any" value="1000000" style="width:100%;margin:4px 0 10px">
      <label class="small" for="inf-year"><strong>Tahun asal uang</strong></label><br>
      <select id="inf-year" style="width:100%;margin:4px 0 12px">${opts}</select>
      <button class="btn" id="inf-run">Hitung Nilai 2024</button>
      <div class="error" id="inf-error" role="alert"></div>
      <div class="result" id="inf-result" hidden></div>
    </section>
    <section class="card">
      <h3>Kalkulator Proyeksi PDB</h3>
      <p class="muted small">Jika PDB tumbuh dengan laju tetap setiap tahun, berapa nilainya beberapa tahun lagi?
      Pertumbuhan majemuk: PDB &times; (1 + laju)<sup>tahun</sup>.</p>
      <label class="small" for="gdp-base"><strong>PDB awal (Rp triliun)</strong></label><br>
      <input type="number" id="gdp-base" min="1" step="any" value="22139" style="width:100%;margin:4px 0 10px">
      <label class="small" for="gdp-rate"><strong>Laju pertumbuhan per tahun (%)</strong></label><br>
      <input type="number" id="gdp-rate" min="0" max="20" step="any" value="5.03" style="width:100%;margin:4px 0 10px">
      <label class="small" for="gdp-years"><strong>Jumlah tahun ke depan</strong></label><br>
      <select id="gdp-years" style="width:100%;margin:4px 0 12px">
        <option value="1">1 tahun</option>
        <option value="3">3 tahun</option>
        <option value="5" selected>5 tahun</option>
        <option value="10">10 tahun</option>
      </select>
      <button class="btn" id="gdp-run">Hitung Proyeksi</button>
      <div class="error" id="gdp-error" role="alert"></div>
      <div class="result" id="gdp-result" hidden></div>
    </section>
  </div>
  <section class="card">
    <h3>Tabel Inflasi yang Dipakai Kalkulator</h3>
    <table class="data">
      <thead><tr><th>Tahun</th><th class="num">Inflasi (%)</th><th class="num">IHK (2019 = 100)</th></tr></thead>
      <tbody>
        ${DATA.economy.inflation
          .map(
            (r) => `<tr><td>${r.year}</td><td class="num">${fmtID(r.value, 2)}</td><td class="num">${fmtID(
              DATA.economy.cpi[r.year],
              2
            )}</td></tr>`
          )
          .join("")}
        <tr class="total"><td>2019 (acuan)</td><td class="num">—</td><td class="num">100,00</td></tr>
      </tbody>
    </table>
    <p class="muted small">Sumber: BPS. IHK 2024 = 113,90 berarti harga-harga naik 13,90% dibanding 2019.</p>
  </section>`;
}

function runInflationCalc() {
  const amount = Number(document.getElementById("inf-amount").value);
  const year = Number(document.getElementById("inf-year").value);
  const err = document.getElementById("inf-error");
  const out = document.getElementById("inf-result");
  err.textContent = "";
  out.hidden = true;
  if (!Number.isFinite(amount) || amount <= 0) {
    err.textContent = "Masukkan jumlah uang yang valid (lebih dari 0).";
    return;
  }
  const cpi = DATA.economy.cpi;
  const factor = cpi[2024] / cpi[year];
  const real = amount * factor;
  const rise = (factor - 1) * 100;
  out.innerHTML = `<strong>${fmtRp(Math.round(real))}</strong><br>
    Uang ${fmtRp(amount)} pada ${year} setara dengan <strong>${fmtRp(
    Math.round(real)
  )}</strong> pada 2024.<br>
    <span class="muted">Harga-harga naik ${fmtID(rise, 2)}% sejak ${year} (IHK ${fmtID(cpi[year], 2)} &rarr; ${fmtID(
    cpi[2024],
    2
  )}). Daya beli uang yang sama turun ${fmtID(100 - 100 / factor, 2)}%.</span>`;
  out.hidden = false;
}

function runGdpCalc() {
  const base = Number(document.getElementById("gdp-base").value);
  const rate = Number(document.getElementById("gdp-rate").value);
  const years = Number(document.getElementById("gdp-years").value);
  const err = document.getElementById("gdp-error");
  const out = document.getElementById("gdp-result");
  err.textContent = "";
  out.hidden = true;
  if (!Number.isFinite(base) || base <= 0) {
    err.textContent = "Masukkan PDB awal yang valid (lebih dari 0).";
    return;
  }
  if (!Number.isFinite(rate) || rate < 0 || rate > 20) {
    err.textContent = "Laju pertumbuhan harus antara 0% dan 20%.";
    return;
  }
  const target = 2024 + years;
  const projected = base * Math.pow(1 + rate / 100, years);
  out.innerHTML = `<strong>Rp${fmtID(projected, 0)} triliun</strong><br>
    PDB tahun ${target} diperkirakan <strong>Rp${fmtID(projected, 0)} triliun</strong>
    bila tumbuh ${fmtID(rate, 2)}% setiap tahun dari Rp${fmtID(base, 0)} triliun (2024).<br>
    <span class="muted">Kenaikan total ${fmtID(((projected / base - 1) * 100), 1)}% dalam ${years} tahun.</span>`;
  out.hidden = false;
}

// ---------- Routing ----------

const PAGES = {
  dashboard: pageDashboard,
  penduduk: pagePenduduk,
  ekonomi: pageEkonomi,
  kerja: pageKerja,
  kemiskinan: pageKemiskinan,
  kalkulator: pageKalkulator,
};

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "").split("?")[0];
  return PAGES[hash] ? hash : "dashboard";
}

function bindPage(route) {
  if (route === "penduduk") {
    renderProvTable();
    const search = document.getElementById("prov-search");
    if (search) {
      search.addEventListener("input", () => {
        provQuery = search.value;
        renderProvTable();
      });
    }
    document.querySelectorAll("#prov-table th button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.sort;
        if (provSort === key) provDir *= -1;
        else {
          provSort = key;
          provDir = key === "name" ? 1 : -1;
        }
        renderProvTable();
      });
    });
  }
  if (route === "ekonomi") {
    renderEcoChart();
    document.getElementById("seg-growth")?.addEventListener("click", () => {
      ecoMode = "growth";
      renderEcoChart();
    });
    document.getElementById("seg-inflation")?.addEventListener("click", () => {
      ecoMode = "inflation";
      renderEcoChart();
    });
  }
  if (route === "kerja") {
    renderSectorChart();
    document.getElementById("seg-count")?.addEventListener("click", () => {
      labourMode = "count";
      renderSectorChart();
    });
    document.getElementById("seg-pct")?.addEventListener("click", () => {
      labourMode = "pct";
      renderSectorChart();
    });
  }
  if (route === "kalkulator") {
    document.getElementById("inf-run")?.addEventListener("click", runInflationCalc);
    document.getElementById("gdp-run")?.addEventListener("click", runGdpCalc);
  }
}

function render() {
  const route = currentRoute();
  navLinks.forEach((a) => a.classList.toggle("active", a.dataset.route === route));
  root.innerHTML = PAGES[route]();
  bindPage(route);
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
