// ==========================================================================
// VARIABEL GLOBAL KUIS
// ==========================================================================
let seluruhDataKuis = null; 
let dataKuisAktif = [];     
let indeksSekarang = 0;     
let jawabanUser = [];       

// ==========================================================================
// AMBIL ELEMEN-ELEMEN HTML
// ==========================================================================
const menuKesulitan = document.getElementById("menu-kesulitan");
const areaGame = document.getElementById("area-game");
const hasilContainer = document.getElementById("hasil-container");

const materiEl = document.getElementById("materi");
const nomorEl = document.getElementById("nomor");
const soalEl = document.getElementById("soal");
const opsiEl = document.getElementById("opsi");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const finishBtn = document.getElementById("finishBtn");
const nilaiSkor = document.getElementById("nilai-skor");
const detailStat = document.getElementById("detail-stat");


// 1. FUNGSI MEMUAT DATA SOAL
function AMBIL_DATA_JSON() {

  if (typeof DATA_SOAL_KUIS !== 'undefined') {
    seluruhDataKuis = DATA_SOAL_KUIS;
    return;
  }

  // Fallback: fetch dari file JSON eksternal (butuh Live Server)
  fetch('data-kuis/kuis.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Gagal memuat berkas JSON. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      seluruhDataKuis = json;
    })
    .catch(err => {
      console.error("Error Fetching JSON:", err);
      if (soalEl) {
        soalEl.innerHTML = `<span style="color: #dc3545; font-weight: bold;">
          Gagal memuat data kuis! Pastikan file kuis-data.js termuat sebelum kuis-konten.js.
        </span>`;
      }
    });
}

// Jumlah soal yang ditampilkan per level
const JUMLAH_SOAL = {
  mudah: 15,
  sedang: 12,
  sulit: 8
};

// Fisher-Yates shuffle untuk mengacak array
function acakArray(arr) {
  const hasil = [...arr];
  for (let i = hasil.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
  }
  return hasil;
}

// ==========================================================================
// 2. FUNGSI PEMILIHAN TINGKAT KESULITAN KUIS
// ==========================================================================
function pilihLevel(level) {
  if (!seluruhDataKuis) {
    alert("Data kuis belum siap atau gagal dimuat. Silakan muat ulang halaman.");
    return;
  }
  
  // Ambil seluruh soal untuk level ini
  const semuaSoal = seluruhDataKuis[level];
  
  // Jika level kosong atau tidak ditemukan datanya
  if (!semuaSoal || semuaSoal.length === 0) {
    alert(`Maaf, soal untuk tingkat kesulitan "${level}" belum tersedia.`);
    return;
  }

  // Acak soal lalu ambil sejumlah JUMLAH_SOAL[level]
  const jumlah = JUMLAH_SOAL[level] || semuaSoal.length;
  const soalAcak = acakArray(semuaSoal);
  dataKuisAktif = soalAcak.slice(0, Math.min(jumlah, soalAcak.length));

  // Inisialisasi ulang state kuis
  jawabanUser = Array(dataKuisAktif.length).fill(null);
  indeksSekarang = 0;
  
  // Atur visibilitas tampilan kontainer halaman
  menuKesulitan.style.display = "none";
  hasilContainer.style.display = "none";
  areaGame.style.display = "block";
  
  // Tampilkan soal pertama
  tampilkanSoal();
}

// ==========================================================================
// 3. FUNGSI MENAMPILKAN BUTIR SOAL DAN OPSI JAWABAN
// ==========================================================================
function tampilkanSoal() {
  if (dataKuisAktif.length === 0) return;

  const data = dataKuisAktif[indeksSekarang];
  
  // Bersihkan sisa elemen kotak pembahasan/penjelasan dari nomor sebelumnya
  const pembBoxLama = document.querySelector(".pembahasan-box");
  if (pembBoxLama) pembBoxLama.remove();

  // Injeksikan data materi, nomor navigasi, dan teks soal ke elemen HTML
  materiEl.innerHTML = data.materi;
  nomorEl.innerText = `Soal ${indeksSekarang + 1} dari ${dataKuisAktif.length}`;
  soalEl.innerHTML = data.soal;

  // Kosongkan daftar opsi jawaban lama sebelum diisi opsi baru
  opsiEl.innerHTML = "";

  // Huruf untuk label opsi jawaban (A, B, C, D, ...)
  const HURUF_OPSI = ["A", "B", "C", "D", "E", "F"];

  // Iterasi pembuatan elemen tombol pilihan ganda
  data.opsi.forEach((opsiTeks, index) => {
    const button = document.createElement("button");
    button.className = "opsi-btn";
    button.innerHTML = `<span class="opsi-huruf">${HURUF_OPSI[index] || String.fromCharCode(65 + index)}.</span> <span class="opsi-teks">${opsiTeks}</span>`;
    
    // PENGECEKAN STATE
    if (jawabanUser[indeksSekarang] !== null) {
      button.disabled = true; 
      
      if (index === data.jawabanIndex) {
        button.classList.add("benar"); 
      }
      if (jawabanUser[indeksSekarang] === index && index !== data.jawabanIndex) {
        button.classList.add("salah"); 
      }
    } else {
      button.onclick = () => pilihJawaban(index);
    }
    
    opsiEl.appendChild(button);
  });

  if (jawabanUser[indeksSekarang] !== null) {
    tampilkanPembahasan(jawabanUser[indeksSekarang] === data.jawabanIndex);
  }

  prevBtn.disabled = indeksSekarang === 0; 
  
  if (indeksSekarang === dataKuisAktif.length - 1) {
    nextBtn.style.display = "none";
    finishBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "inline-block";
    finishBtn.style.display = "none";
  }

  // Render ulang notasi matematika (MathJax) pada materi, soal, dan opsi jawaban
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([materiEl, soalEl, opsiEl]).catch(err => console.error("MathJax error:", err));
  }
}

// 4. FUNGSI EKSEKUSI JAWABAN SAAT OPSI DIKLIK
function pilihJawaban(indeksPilihan) {
  const data = dataKuisAktif[indeksSekarang];
  jawabanUser[indeksSekarang] = indeksPilihan; 

  const semuaTombolOpsi = opsiEl.querySelectorAll(".opsi-btn");
  semuaTombolOpsi.forEach((button, index) => {
    button.disabled = true; 
    
    if (index === data.jawabanIndex) {
      button.classList.add("benar"); 
    } else if (index === indeksPilihan) {
      button.classList.add("salah"); 
    }
  });

  // Validasi kecocokan nilai untuk memicu warna border pada kotak pembahasan
  const apakahBenar = indeksPilihan === data.jawabanIndex;
  tampilkanPembahasan(apakahBenar);
}


// 5. FUNGSI PEMBUATAN WADAH INDIKATOR & TEKS PENJELASAN
function tampilkanPembahasan(apakahBenar) {
  const data = dataKuisAktif[indeksSekarang];
  
  const pembBox = document.createElement("div");

  pembBox.className = `pembahasan-box ${apakahBenar ? 'status-benar' : 'status-salah'}`;
  
  const statusTeks = apakahBenar 
    ? "<strong style='color:#28a745;'>✓ Jawaban Anda Benar!</strong>" 
    : "<strong style='color:#dc3545;'>✗ Jawaban Anda Salah!</strong>";

  pembBox.innerHTML = `
    <div style="margin-bottom: 8px;">${statusTeks}</div>
    <div><strong>Penjelasan:</strong> ${data.pembahasan}</div>
  `;
  
  opsiEl.after(pembBox);

  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([pembBox]).catch(err => console.error("MathJax error:", err));
  }
}

// 6. LOGIKA TOMBOL NAVIGASI DAN KALKULASI SKOR AKHIR
prevBtn.onclick = () => {
  if (indeksSekarang > 0) {
    indeksSekarang--;
    tampilkanSoal();
  }
};

nextBtn.onclick = () => {
  if (indeksSekarang < dataKuisAktif.length - 1) {
    indeksSekarang++;
    tampilkanSoal();
  }
};

// ============================================================
// MODAL KONFIRMASI SELESAI (modern)
// ============================================================
function buatModal() {
  if (document.getElementById('modal-konfirmasi')) return;

  const overlay = document.createElement('div');
  overlay.id = 'modal-konfirmasi';
  overlay.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-card">
      <div class="modal-icon" id="modal-icon">⚠️</div>
      <h3 class="modal-judul" id="modal-judul">Soal Belum Lengkap</h3>
      <p class="modal-pesan" id="modal-pesan"></p>
      <div class="modal-aksi">
        <button class="modal-btn modal-btn-batal" id="modal-batal">Kembali ke Soal</button>
        <button class="modal-btn modal-btn-lanjut" id="modal-lanjut">Selesai Sekarang</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('modal-batal').onclick = tutupModal;
  document.getElementById('modal-lanjut').onclick = () => { tutupModal(); selesaikanKuis(); };
  overlay.querySelector('.modal-backdrop').onclick = tutupModal;
}

function bukaModal(belumDijawab) {
  buatModal();
  const modal = document.getElementById('modal-konfirmasi');
  const pesan = document.getElementById('modal-pesan');
  const icon = document.getElementById('modal-icon');
  const judul = document.getElementById('modal-judul');

  if (belumDijawab > 0) {
    icon.textContent = '⚠️';
    judul.textContent = 'Ada Soal yang Belum Dijawab!';
    pesan.innerHTML = `Masih ada <strong>${belumDijawab} soal</strong> yang belum kamu jawab.<br>Anda yakin untuk selesai?`;
  } else {
    icon.textContent = '✅';
    judul.textContent = 'Siap Mengumpulkan?';
    pesan.innerHTML = `Semua soal sudah dijawab.<br>Anda yakin untuk selesai?`;
  }

  modal.classList.add('aktif');
  requestAnimationFrame(() => modal.querySelector('.modal-card').classList.add('masuk'));
}

function tutupModal() {
  const modal = document.getElementById('modal-konfirmasi');
  if (!modal) return;
  modal.querySelector('.modal-card').classList.remove('masuk');
  setTimeout(() => modal.classList.remove('aktif'), 280);
}

function selesaikanKuis() {
  let jumlahBenar = 0;
  let belumDijawab = 0;

  dataKuisAktif.forEach((soal, i) => {
    if (jawabanUser[i] === soal.jawabanIndex) jumlahBenar++;
    if (jawabanUser[i] === null) belumDijawab++;
  });

  const totalSkor = Math.round((jumlahBenar / dataKuisAktif.length) * 100);

  areaGame.style.display = "none";
  hasilContainer.style.display = "block";

  nilaiSkor.innerText = totalSkor;
  const jumlahSalah = dataKuisAktif.length - jumlahBenar - belumDijawab;
  detailStat.innerHTML = `Benar: <b>${jumlahBenar}</b> | Salah: <b>${jumlahSalah}</b> ${belumDijawab > 0 ? `| Belum Dijawab: <b>${belumDijawab}</b>` : ''}`;
}

// Fungsi ketika tombol SELESAI ditekan
finishBtn.onclick = () => {
  let belumDijawab = 0;
  jawabanUser.forEach(j => { if (j === null) belumDijawab++; });
  bukaModal(belumDijawab);
};

// Fungsi tombol Main Lagi untuk kembali ke Menu Utama tingkat kesulitan
function ulangiKuis() {
  hasilContainer.style.display = "none";
  menuKesulitan.style.display = "block";
}


// KICK-START: JALANKAN PROSES PERTAMA KALI 
AMBIL_DATA_JSON();
