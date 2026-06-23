// ==========================================
// 1. ELEMENT HTML
// ==========================================
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const btnAnimasi = document.querySelector(".animasi-btn");
const toggleGridElem = document.getElementById('toggle-grid');
const toggleCoordsElem = document.getElementById('toggle-koordinat');
const latexAwal = document.getElementById("latexAwal");
const latexHasil = document.getElementById("latexHasil");
const latexParameter = document.getElementById("latexParameter");
const labelOverlay = document.getElementById("labelOverlay");

// ==========================================
// 2. KONFIGURASI CANVAS
// ==========================================
const width = canvas.width;
const height = canvas.height;

let originX = width / 2;
let originY = height / 2;
let gridSize = 40;

// ==========================================
// 3. STATE APLIKASI
// ==========================================
let isDragging = false;
let startX, startY;
let sumbuRefleksiAktif = "x";
let transformasiAktif = null;

// MODE POLIGON
let titikObjek = [];
let bentukSelesai = false;
let titikTerpilih = null;
let objekAwal = [];
let objekHasil = [];
let stateAwalTransformasi = [];
let stateHasilTransformasi = [];

// UNDO / REDO STACK (untuk titik awal sebelum transformasi)
let undoStack = [];
let redoStack = [];

// WARNA UNTUK TRANSFORMASI
const WARNA_OBJEK_AWAL = "#FF6B6B";      
const WARNA_OBJEK_HASIL = "#4ECDC4";    
const WARNA_GARIS_TRACKING = "#FFD93D"; 
const WARNA_GARIS_CERMIN = "#FF9F43"; 

// FUNGSI KONVERSI HEX KE RGBA
function hexToRgba(hex, alpha = 0.3) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ==========================================
// 3A. UNDO / REDO HELPERS
// ==========================================
function simpanStateUntukUndo() {
    undoStack.push(titikObjek.map(t => ({ x: t.x, y: t.y })));
    redoStack = [];
    updateUndoRedoBtn();
}

function updateUndoRedoBtn() {
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    if (btnUndo) btnUndo.disabled = undoStack.length === 0 || bentukSelesai;
    if (btnRedo) btnRedo.disabled = redoStack.length === 0 || bentukSelesai;
}

// ==========================================
// 3B. UTILITAS BILANGAN PECAHAN
// ==========================================
const GRID_SNAP_DENOM = 4;
const MAX_DENOM_TEBAK = 12;

function fpb(a, b) {
    a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
}


function bersihkanFloat(v) {
    return Math.round(v * 10000) / 10000;
}

function snapPecahan(v, denom = GRID_SNAP_DENOM) {
    return bersihkanFloat(Math.round(v * denom) / denom);
}

function pecahkanDesimal(x, maxDenom = MAX_DENOM_TEBAK) {
    if (Number.isInteger(x)) return { num: x, den: 1 };
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    let bestNum = Math.round(absX), bestDen = 1, bestErr = Math.abs(absX - bestNum);
    for (let den = 2; den <= maxDenom; den++) {
        const num = Math.round(absX * den);
        const err = Math.abs(absX - num / den);
        if (err < bestErr - 1e-9) { bestErr = err; bestNum = num; bestDen = den; }
    }
    const g = fpb(bestNum, bestDen);
    return { num: sign * (bestNum / g), den: bestDen / g };
}

function formatPecahanTeks(x) {
    const { num, den } = pecahkanDesimal(x);
    if (den === 1) return `${num}`;
    return `${num}/${den}`;
}

function formatPecahanLatex(x) {
    const { num, den } = pecahkanDesimal(x);
    if (den === 1) return `${num}`;
    const sign = num < 0 ? "-" : "";
    return `${sign}\\frac{${Math.abs(num)}}{${den}}`;
}

// Bungkus nilai negatif dengan kurung agar tampil jelas saat disubstitusikan, mis. "x - (-2)"
function bungkusLatex(nilai, latex) {
    return nilai < 0 ? `(${latex})` : latex;
}

// ==========================================
// 3C. LABEL TITIK DI CANVAS (DIRENDER MATHJAX, BUKAN ctx.fillText)
// ==========================================
const labelPoolTitik = {};
let labelKeysAktif = new Set();
let pendingLabelTypeset = [];
const LABEL_OFFSET_X = 10;
const LABEL_OFFSET_Y = -10;

function tampilkanLabelMath(key, x, y, texInner, warna = "#0F52BA") {
    labelKeysAktif.add(key);
    const tex = `\\(${texInner}\\)`;

    let entry = labelPoolTitik[key];
    if (!entry) {
        const el = document.createElement("div");
        el.className = "titik-label";
        labelOverlay.appendChild(el);
        entry = labelPoolTitik[key] = { el, lastTex: null, anchorX: 0, anchorY: 0 };
    }

    entry.anchorX = x;
    entry.anchorY = y;
    entry.el.style.display = "block";
    entry.el.style.left = (x + LABEL_OFFSET_X) + "px";
    entry.el.style.top = (y + LABEL_OFFSET_Y) + "px";
    entry.el.style.color = warna;

    if (entry.lastTex !== tex) {
        entry.lastTex = tex;
        entry.el.innerHTML = tex;
        if (window.MathJax && MathJax.typesetPromise) {
            pendingLabelTypeset.push(MathJax.typesetPromise([entry.el]).catch(() => {}));
        }
    }
}

function tampilkanLabelTitik(key, x, y, namaTitik, mx, my) {
    const xLatex = formatPecahanLatex(mx === 0 ? 0 : mx);
    const yLatex = formatPecahanLatex(my === 0 ? 0 : my);
    tampilkanLabelMath(key, x, y, `${namaTitik}(${xLatex},\\ ${yLatex})`, "#0F52BA");
}

function sembunyikanLabelTidakAktif() {
    Object.keys(labelPoolTitik).forEach(key => {
        if (!labelKeysAktif.has(key)) {
            labelPoolTitik[key].el.style.display = "none";
        }
    });
}

// Rapikan label titik yang posisinya saling berdekatan/bertabrakan agar tidak menumpuk
function aturTabrakanLabel() {
    const entries = Object.keys(labelPoolTitik)
        .filter(k => labelKeysAktif.has(k))
        .map(k => labelPoolTitik[k])
        .filter(e => e.el.style.display !== "none");

    // Kembalikan dulu semua label aktif ke posisi dasarnya (anchor + offset default)
    entries.forEach(e => {
        e.el.style.left = (e.anchorX + LABEL_OFFSET_X) + "px";
        e.el.style.top = (e.anchorY + LABEL_OFFSET_Y) + "px";
    });

    if (entries.length < 2) return;

    const jarakAman = 4;
    const maxIterasi = 10;

    for (let iter = 0; iter < maxIterasi; iter++) {
        let adaTabrakan = false;

        for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
                const a = entries[i], b = entries[j];
                const ra = a.el.getBoundingClientRect();
                const rb = b.el.getBoundingClientRect();

                const overlapX = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
                const overlapY = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);

                if (overlapX + jarakAman > 0 && overlapY + jarakAman > 0) {
                    adaTabrakan = true;

                    const dorongY = overlapY + jarakAman;
                    // Dorong label "b" menjauh secara vertikal dari label "a", arah ditentukan
                    // dari posisi titik aslinya supaya tidak bolak-balik tertindih lagi
                    const arahBawah = b.anchorY >= a.anchorY;
                    const setengah = dorongY / 2;

                    const topA = parseFloat(a.el.style.top);
                    const topB = parseFloat(b.el.style.top);
                    a.el.style.top = (topA + (arahBawah ? -setengah : setengah)) + "px";
                    b.el.style.top = (topB + (arahBawah ? setengah : -setengah)) + "px";
                }
            }
        }

        if (!adaTabrakan) break;
    }
}


function setLabelLatex(el, texInner) {
    if (!el) return;
    el.innerHTML = `\\(${texInner}\\)`;
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([el]).catch(() => {});
    }
}

const REFLEKSI_LATEX = {
    'x': "\\text{Sumbu}\\ x",
    'y': "\\text{Sumbu}\\ y",
    'x=k': "\\text{Garis}\\ x = k",
    'y=k': "\\text{Garis}\\ y = k",
    'y=x': "\\text{Garis}\\ y = x",
    'y=-x': "\\text{Garis}\\ y = -x",
    'o': "\\text{Titik Pusat}\\ O(0,0)"
};

function parsePecahan(input) {
    const str = (input === null || input === undefined) ? "" : String(input).trim();
    if (str === "") return { value: 0, latex: "0", teks: "0" };

    if (str.includes("/")) {
        const bagian = str.split("/");
        const a = parseFloat(bagian[0]);
        const b = parseFloat(bagian[1]);
        if (!isNaN(a) && !isNaN(b) && b !== 0) {
            const value = bersihkanFloat(a / b);
            const g = fpb(a, b);
            const sign = (a < 0) !== (b < 0) ? -1 : 1;
            const numAbs = Math.abs(Math.round(a)) / g;
            const denAbs = Math.abs(Math.round(b)) / g;
            const teks = denAbs === 1 ? `${sign * numAbs}` : `${sign < 0 ? "-" : ""}${numAbs}/${denAbs}`;
            const latex = denAbs === 1 ? `${sign * numAbs}` : `${sign < 0 ? "-" : ""}\\frac{${numAbs}}{${denAbs}}`;
            return { value, latex, teks };
        }
    }
    const value = parseFloat(str);
    if (isNaN(value)) return { value: 0, latex: "0", teks: "0" };
    return { value, latex: formatPecahanLatex(value), teks: formatPecahanTeks(value) };
}

function ambilNilai(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    return parsePecahan(el.value).value;
}

function ambilLatex(id) {
    const el = document.getElementById(id);
    if (!el) return "0";
    return parsePecahan(el.value).latex;
}

// ==========================================
// 3D. PREVIEW LATEX UNTUK NILAI YANG DIKETIK PENGGUNA
// ==========================================
function updateInputPreview(inputId, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return;
    const latex = ambilLatex(inputId);
    preview.innerHTML = `\\(= ${latex}\\)`;
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([preview]).catch(() => {});
    }
}

function updateSemuaPreview() {
    updateInputPreview("nilaiA", "previewA");
    updateInputPreview("nilaiB", "previewB");
    updateInputPreview("nilaiSudut", "previewSudut");
    updateInputPreview("dilatasiA", "previewDilatasiA");
    updateInputPreview("dilatasiB", "previewDilatasiB");
    updateInputPreview("nilaiK", "previewK");
}

// ==========================================
// 4. KONVERSI KOORDINAT
// ==========================================
function canvasToMath(x, y) {
    let rawX = (x - originX) / gridSize;
    let rawY = (originY - y) / gridSize;
    return { x: snapPecahan(rawX), y: snapPecahan(rawY) };
}

function mathToCanvas(x, y) {
    return { 
        x: originX + x * gridSize, 
        y: originY - y * gridSize 
    };
}

// ==========================================
// 5. FUNGSI GAMBAR TRACKING LINTASAN
// ==========================================
function gambarTracking() {
    if (objekAwal.length === 0 || objekHasil.length === 0) return;

    ctx.save();
    
    const a = ambilNilai("nilaiA");
    const b = ambilNilai("nilaiB");

    for (let i = 0; i < objekAwal.length; i++) {
        if (!objekAwal[i] || !objekHasil[i]) continue;

        const p1 = mathToCanvas(objekAwal[i].x, objekAwal[i].y);
        const p2 = mathToCanvas(objekHasil[i].x, objekHasil[i].y);

        if (transformasiAktif === "rotasi") {
            const pusatCanvas = mathToCanvas(a, b);
            const dx = p1.x - pusatCanvas.x;
            const dy = p1.y - pusatCanvas.y;
            const radius = Math.sqrt(dx * dx + dy * dy);

            if (radius < 1) continue;

            const sudutAwal = Math.atan2(dy, dx);
            const dx2 = p2.x - pusatCanvas.x;
            const dy2 = p2.y - pusatCanvas.y;
            const sudutAkhir = Math.atan2(dy2, dx2);

            const sudutInput = ambilNilai("nilaiSudut");
            
            const berlawananArahJarumJam = sudutInput >= 0; 

            // RENDER JARI-JARI PUTUS-PUTUS
            ctx.save();
            ctx.strokeStyle = "#888888"; 
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]); 
            
            ctx.beginPath();
            ctx.moveTo(pusatCanvas.x, pusatCanvas.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.moveTo(pusatCanvas.x, pusatCanvas.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();

            // RENDER LINTASAN BUSUR
            ctx.save();
            ctx.beginPath();
            ctx.arc(pusatCanvas.x, pusatCanvas.y, radius, sudutAwal, sudutAkhir, berlawananArahJarumJam); 

            ctx.strokeStyle = WARNA_GARIS_TRACKING; 
            ctx.lineWidth = 2.5;
            ctx.setLineDash([]); 
            ctx.stroke();
            ctx.restore();

        } else if (transformasiAktif === "dilatasi") {
            const dilA = ambilNilai("dilatasiA");
            const dilB = ambilNilai("dilatasiB");
            const pusatDilatasiCanvas = mathToCanvas(dilA, dilB);

            ctx.save();
            ctx.strokeStyle = WARNA_GARIS_TRACKING;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(pusatDilatasiCanvas.x, pusatDilatasiCanvas.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
            
        } else {
            ctx.save();
            ctx.strokeStyle = WARNA_GARIS_TRACKING;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
        }
    }
    ctx.restore();
}

function gambarGarisCerminK() {
    if (transformasiAktif !== "refleksi") return;

    ctx.save();
    ctx.strokeStyle = WARNA_GARIS_CERMIN;
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);

    ctx.beginPath();
    if (sumbuRefleksiAktif === "x=k") {
        const nilaiK = ambilNilai("nilaiK");
        const p = mathToCanvas(nilaiK, 0);
        ctx.moveTo(p.x, 0); ctx.lineTo(p.x, height);
        ctx.stroke();
    } else if (sumbuRefleksiAktif === "y=k") {
        const nilaiK = ambilNilai("nilaiK");
        const p = mathToCanvas(0, nilaiK);
        ctx.moveTo(0, p.y); ctx.lineTo(width, p.y);
        ctx.stroke();
    } else if (sumbuRefleksiAktif === "y=x") {
        const p1 = mathToCanvas(-50, -50);
        const p2 = mathToCanvas(50, 50);
        ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    } else if (sumbuRefleksiAktif === "y=-x") {
        const p1 = mathToCanvas(-50, 50);
        const p2 = mathToCanvas(50, -50);
        ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    } else if (sumbuRefleksiAktif === "o") {
        const p = mathToCanvas(0, 0);
        ctx.restore();
        ctx.save();
        ctx.fillStyle = WARNA_GARIS_CERMIN;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function gambarTitikPusatRotasiDanDilatasi() {
    if (transformasiAktif === "rotasi") {
        const px = ambilNilai("nilaiA");
        const py = ambilNilai("nilaiB");
        const p = mathToCanvas(px, py);

        ctx.save();
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        const xLatex = formatPecahanLatex(px === 0 ? 0 : px);
        const yLatex = formatPecahanLatex(py === 0 ? 0 : py);
        tampilkanLabelMath("pusatRotasi", p.x, p.y + 8, `P(${xLatex},\\ ${yLatex})`, "#FF0000");
    } else if (transformasiAktif === "dilatasi") {
        const dilA = ambilNilai("dilatasiA");
        const dilB = ambilNilai("dilatasiB");
        const p = mathToCanvas(dilA, dilB);

        ctx.save();
        ctx.fillStyle = "#E74C3C";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        const xLatex = formatPecahanLatex(dilA === 0 ? 0 : dilA);
        const yLatex = formatPecahanLatex(dilB === 0 ? 0 : dilB);
        tampilkanLabelMath("pusatDilatasi", p.x, p.y + 8, `\\text{Pusat}\\ D(${xLatex},\\ ${yLatex})`, "#E74C3C");
    }
}

function gambarPoligon(data = titikObjek, warna = "#000000", bayangan = false, kindKey = "objek") {
    if (data.length === 0) return;

    ctx.strokeStyle = warna;
    ctx.lineWidth = 3;

    data.forEach((titik, index) => {
        const p = mathToCanvas(titik.x, titik.y);

        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = warna;
        ctx.fill();
        
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        let namaTitik = String.fromCharCode(65 + index);
        if (bayangan) namaTitik += "'";

        tampilkanLabelTitik(kindKey + "-" + index, p.x, p.y, namaTitik, titik.x, titik.y);
    });

    if (data.length > 1) {
        ctx.strokeStyle = warna; ctx.lineWidth = 3;
        ctx.beginPath();
        const first = mathToCanvas(data[0].x, data[0].y);
        ctx.moveTo(first.x, first.y);

        for (let i = 1; i < data.length; i++) {
            const p = mathToCanvas(data[i].x, data[i].y);
            ctx.lineTo(p.x, p.y);
        }

        if (bentukSelesai && data.length >= 3) {
            ctx.closePath();
            ctx.fillStyle = hexToRgba(warna, 0.2);
            ctx.fill();
        }
        ctx.stroke();
    }
}

// ==========================================
// 6. FUNGSI TRANSFORMASI
// ==========================================
function translasi(dx, dy) {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    objekHasil = titikObjek.map(t => ({ x: t.x + dx, y: t.y + dy }));
    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}

function refleksiX() {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    objekHasil = titikObjek.map(t => ({ x: t.x, y: -t.y }));
    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}

function refleksiY() {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    objekHasil = titikObjek.map(t => ({ x: -t.x, y: t.y }));
    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}

function refleksiGarisXkeK(k) {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    objekHasil = titikObjek.map(t => ({ x: 2 * k - t.x, y: t.y }));
    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}

function refleksiGarisYkeK(k) {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    objekHasil = titikObjek.map(t => ({ x: t.x, y: 2 * k - t.y }));
    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}

function refleksiYX() {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    objekHasil = titikObjek.map(t => ({ x: t.y, y: t.x }));
    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}

function refleksiYMinusX() {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    objekHasil = titikObjek.map(t => ({ x: -t.y, y: -t.x }));
    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}

function refleksiPusatO() {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    objekHasil = titikObjek.map(t => ({ x: -t.x, y: -t.y }));
    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}


function rotasi(sudut, pusatA = 0, pusatB = 0) {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    const rad = sudut * Math.PI / 180;

    objekHasil = titikObjek.map(titik => {
        let xDigeser = titik.x - pusatA;
        let yDigeser = titik.y - pusatB;
        return {
            x: bersihkanFloat(xDigeser * Math.cos(rad) - yDigeser * Math.sin(rad) + pusatA),
            y: bersihkanFloat(xDigeser * Math.sin(rad) + yDigeser * Math.cos(rad) + pusatB)
        };
    });

    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}

function dilatasi(skala, pusatA = 0, pusatB = 0) {
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    objekHasil = titikObjek.map(t => ({ 
        x: bersihkanFloat(skala * (t.x - pusatA) + pusatA), 
        y: bersihkanFloat(skala * (t.y - pusatB) + pusatB) 
    }));
    titikObjek = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
}

// ==========================================
// 7. FUNGSI KHUSUS HITUNG TARGET PRE-ANIMASI
// ==========================================
function hitungTranslasi(dx, dy) { return titikObjek.map(t => ({ x: t.x + dx, y: t.y + dy })); }
function hitungRefleksiX() { return titikObjek.map(t => ({ x: t.x, y: -t.y })); }
function hitungRefleksiY() { return titikObjek.map(t => ({ x: -t.x, y: t.y })); }
function hitungRefleksiGarisXkeK(k) { return titikObjek.map(t => ({ x: 2 * k - t.x, y: t.y })); }
function hitungRefleksiGarisYkeK(k) { return titikObjek.map(t => ({ x: t.x, y: 2 * k - t.y })); }
function hitungRefleksiYX() { return titikObjek.map(t => ({ x: t.y, y: t.x })); }
function hitungRefleksiYMinusX() { return titikObjek.map(t => ({ x: -t.y, y: -t.x })); }
function hitungRefleksiPusatO() { return titikObjek.map(t => ({ x: -t.x, y: -t.y })); }


function hitungRotasi(sudut, pusatA = 0, pusatB = 0) {
    const rad = sudut * Math.PI / 180;
    return titikObjek.map(t => {
        let xDigeser = t.x - pusatA;
        let yDigeser = t.y - pusatB;
        return {
            x: bersihkanFloat(xDigeser * Math.cos(rad) - yDigeser * Math.sin(rad) + pusatA),
            y: bersihkanFloat(xDigeser * Math.sin(rad) + yDigeser * Math.cos(rad) + pusatB)
        };
    });
}
function hitungDilatasi(skala, pusatA = 0, pusatB = 0) { 
    return titikObjek.map(t => ({ 
        x: bersihkanFloat(skala * (t.x - pusatA) + pusatA), 
        y: bersihkanFloat(skala * (t.y - pusatB) + pusatB) 
    })); 
}

// ==========================================
// 8. ENGINE ANIMASI (DIKEMBALIKAN KE VERSI AWAL)
// ==========================================
function animasikanTransformasi(targetPoints, durasi = 1500) {
    const startPoints = titikObjek.map(t => ({ x: t.x, y: t.y }));
    let startTime = null;

    const a = ambilNilai("nilaiA");
    const b = ambilNilai("nilaiB");
    const sudutTarget = ambilNilai("nilaiSudut");

    objekAwal = startPoints.map(t => ({ x: t.x, y: t.y }));

    function frame(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / durasi;
        if (progress > 1) progress = 1;

        if (transformasiAktif === "rotasi") {
            
            let sudutSekarang = sudutTarget * progress;
            const rad = sudutSekarang * Math.PI / 180;

            objekHasil = startPoints.map((awal) => {
                let xDigeser = awal.x - a;
                let yDigeser = awal.y - b;
                return {
                    x: xDigeser * Math.cos(rad) - yDigeser * Math.sin(rad) + a,
                    y: xDigeser * Math.sin(rad) + yDigeser * Math.cos(rad) + b
                };
            });
        } else if (transformasiAktif === "dilatasi") {
            const dilA = ambilNilai("dilatasiA");
            const dilB = ambilNilai("dilatasiB");
            const skalaTarget = ambilNilai("nilaiA") || 1;

            let skalaSekarang = 1 + (skalaTarget - 1) * progress;
            objekHasil = startPoints.map((awal) => {
                return {
                    x: skalaSekarang * (awal.x - dilA) + dilA,
                    y: skalaSekarang * (awal.y - dilB) + dilB
                };
            });
        } else {
            objekHasil = startPoints.map((awal, i) => ({
                x: awal.x + (targetPoints[i].x - awal.x) * progress,
                y: awal.y + (targetPoints[i].y - awal.y) * progress
            }));
        }

        drawCartesian();

        if (progress < 1) {
            requestAnimationFrame(frame);
        } else {
            titikObjek = targetPoints.map(t => ({ x: t.x, y: t.y }));
            objekHasil = targetPoints.map(t => ({ x: t.x, y: t.y }));
            updateLatexKoordinat();
            drawCartesian();
        }
    }
    requestAnimationFrame(frame);
}

function animasiDariRiwayat(durasi = 1500) {
    if (stateAwalTransformasi.length === 0 || stateHasilTransformasi.length === 0) {
        alert("Lakukan transformasi (klik TERAPKAN) terlebih dahulu"); return;
    }
    titikObjek = stateAwalTransformasi.map(t => ({ x: t.x, y: t.y }));
    objekAwal = stateAwalTransformasi.map(t => ({ x: t.x, y: t.y }));
    objekHasil = [];
    drawCartesian();
    animasikanTransformasi(stateHasilTransformasi, durasi);
}

// ==========================================
// 9. DROPDOWN MANAGEMENT
// ==========================================
function toggleDropdown() {
    const menu = document.getElementById("dropdownMenu");
    const btn = document.getElementById("btnDropdown");
    menu.classList.toggle("show"); btn.classList.toggle("active");
}

function toggleDropdownRefleksi() {
    const menu = document.getElementById("dropdownRefleksi");
    const btn = document.getElementById("btnDropdownRefleksi");
    menu.classList.toggle("show"); btn.classList.toggle("active");
}

function pilihRefleksi(event, sumbu, nama) {
    event.stopPropagation();
    sumbuRefleksiAktif = sumbu;
    setLabelLatex(document.getElementById("labelRefleksi"), REFLEKSI_LATEX[sumbu] || nama);

    const inputGarisK = document.getElementById("inputGarisK");
    const labelGarisK = document.getElementById("labelGarisK");

    if (sumbu === 'x=k' || sumbu === 'y=k') {
        inputGarisK.style.display = "flex";
        setLabelLatex(labelGarisK, sumbu === 'x=k' ? "\\text{Nilai}\\ k\\ (x = k)" : "\\text{Nilai}\\ k\\ (y = k)");
    } else {
        inputGarisK.style.display = "none";
    }

    updateParameterLatex(); toggleDropdownRefleksi(); drawCartesian();
    stateAwalTransformasi = []; stateHasilTransformasi = [];
    updateLangkahKerjaDinamis();
    updateSemuaPreview();
}

function pilihTransformasi(event, jenis, nama) {
    event.stopPropagation();
    transformasiAktif = jenis;
    document.getElementById("btnLabel").textContent = nama;

    const labelA = document.getElementById("labelA");
    const labelB = document.getElementById("labelB");
    const groupA = document.getElementById("groupA");
    const groupB = document.getElementById("groupB");
    const groupSudut = document.getElementById("groupSudut");
    const panelRefleksi = document.getElementById("panelRefleksi");
    const groupPusatDilatasi = document.getElementById("groupPusatDilatasi");

    groupA.style.display = "flex";
    groupB.style.display = "flex";
    groupSudut.style.display = "none";
    panelRefleksi.style.display = "none";
    if (groupPusatDilatasi) groupPusatDilatasi.style.display = "none";

    if (jenis === "rotasi") {
        setLabelLatex(labelA, "\\text{Pusat}\\ a\\ (\\text{sumbu-}x)");
        setLabelLatex(labelB, "\\text{Pusat}\\ b\\ (\\text{sumbu-}y)");
        groupSudut.style.display = "flex";
    } else if (jenis === "dilatasi") {
        setLabelLatex(labelA, "\\text{Skala}\\ (k)");
        groupB.style.display = "none";
        if (groupPusatDilatasi) groupPusatDilatasi.style.display = "flex";
    } else if (jenis === "refleksi") {
        groupA.style.display = "none";
        groupB.style.display = "none";
        panelRefleksi.style.display = "flex";
        pilihRefleksi(event, 'x', 'Sumbu X');
    } else { 
        setLabelLatex(labelA, "a\\ (\\text{sumbu-}x)");
        setLabelLatex(labelB, "b\\ (\\text{sumbu-}y)");
    }

    updateParameterLatex(); toggleDropdown(); drawCartesian();
    stateAwalTransformasi = []; stateHasilTransformasi = [];
    updateLangkahKerjaDinamis();
    updateSemuaPreview();
}

// ==========================================
// 10. RENDER UTAMA KARTESIUS
// ==========================================
function drawCartesian() {
    ctx.clearRect(0, 0, width, height);
    labelKeysAktif = new Set();
    pendingLabelTypeset = [];
    const showGrid = toggleGridElem ? toggleGridElem.checked : true;
    const showCoords = toggleCoordsElem ? toggleCoordsElem.checked : true;
    const radius = 20;

    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.roundRect(0, 0, width, height, radius); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, width, height, radius); ctx.clip();

    if (showGrid) {
        ctx.strokeStyle = "#e0e0e0"; ctx.lineWidth = 1;
        const startGridX = originX % gridSize;
        for (let x = startGridX; x < width; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        const startGridY = originY % gridSize;
        for (let y = startGridY; y < height; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
    }

    ctx.strokeStyle = "#222"; ctx.lineWidth = 2.5;
    if (originY >= 0 && originY <= height) {
        ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(width, originY); ctx.stroke();
    }
    if (originX >= 0 && originX <= width) {
        ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, height); ctx.stroke();
    }

    gambarGarisCerminK();
    gambarTitikPusatRotasiDanDilatasi();

    if (showCoords) {
        ctx.font = "bold 11px Arial"; ctx.fillStyle = "#222";
        const startGridX = originX % gridSize; const startGridY = originY % gridSize;

        ctx.textAlign = "center"; ctx.textBaseline = "top";
        const labelYOffset = Math.min(Math.max(10, originY + 6), height - 20);
        for (let x = startGridX; x < width; x += gridSize) {
            const mathX = Math.round((x - originX) / gridSize);
            if (mathX !== 0) ctx.fillText(mathX, x, labelYOffset);
        }

        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        const labelXOffset = Math.min(Math.max(15, originX - 6), width - 10);
        for (let y = startGridY; y < height; y += gridSize) {
            const mathY = Math.round((originY - y) / gridSize);
            if (mathY !== 0) ctx.fillText(mathY, labelXOffset, y);
        }
        if (originX >= 0 && originX <= width && originY >= 0 && originY <= height) {
            ctx.fillText("0", originX - 6, originY + 6);
        }
    }

    if (objekAwal.length > 0) gambarPoligon(objekAwal, WARNA_OBJEK_AWAL, false, "awal");
    gambarTracking();
    if (objekHasil.length > 0) gambarPoligon(objekHasil, WARNA_OBJEK_HASIL, true, "hasil");
    else if (objekAwal.length === 0) gambarPoligon(titikObjek, "#000000", false, "objek");

    sembunyikanLabelTidakAktif();

    Promise.all(pendingLabelTypeset).then(() => {
        requestAnimationFrame(aturTabrakanLabel);
    });

    ctx.restore();
}

function updateLatexKoordinat() {
    if (!latexAwal || !latexHasil) return;
    let latex1 = "\\[\\begin{array}{|c|c|c|}\\hline Titik & x & y \\\\ \\hline ";
    objekAwal.forEach((t, index) => {
        let nama = String.fromCharCode(65 + index);
        latex1 += nama + " & " + formatPecahanLatex(t.x) + " & " + formatPecahanLatex(t.y) + " \\\\ ";
    });
    latex1 += "\\hline\\end{array}\\]";

    let latex2 = "\\[\\begin{array}{|c|c|c|}\\hline Titik & x' & y' \\\\ \\hline ";
    objekHasil.forEach((t, index) => {
        let nama = String.fromCharCode(65 + index) + "'";
        latex2 += nama + " & " + formatPecahanLatex(t.x) + " & " + formatPecahanLatex(t.y) + " \\\\ ";
    });
    latex2 += "\\hline\\end{array}\\]";

    latexAwal.innerHTML = objekAwal.length ? latex1 : "";
    latexHasil.innerHTML = objekHasil.length ? latex2 : "";
    if (window.MathJax) MathJax.typesetPromise();
}

function updateParameterLatex() {
    if (!latexParameter) return;
    const a = ambilLatex("nilaiA");
    const b = ambilLatex("nilaiB");
    const sudut = ambilLatex("nilaiSudut");
    const k = document.getElementById("nilaiK") ? ambilLatex("nilaiK") : "0";
    let latex = "";

    switch (transformasiAktif) {
        case "translasi": latex = `\\[ T(${a},${b}) \\]`; break;
        case "refleksi":
            if (sumbuRefleksiAktif === "x") latex = `\\[ Ref_{Sumbu\\ X} \\]`;
            else if (sumbuRefleksiAktif === "y") latex = `\\[ Ref_{Sumbu\\ Y} \\]`;
            else if (sumbuRefleksiAktif === "x=k") latex = `\\[ Ref_{x = ${k}} \\]`;
            else if (sumbuRefleksiAktif === "y=k") latex = `\\[ Ref_{y = ${k}} \\]`;
            else if (sumbuRefleksiAktif === "y=x") latex = `\\[ Ref_{y = x} \\]`;
            else if (sumbuRefleksiAktif === "y=-x") latex = `\\[ Ref_{y = -x} \\]`;
            else if (sumbuRefleksiAktif === "o") latex = `\\[ Ref_{O(0,0)} \\]`;
            break;
        case "rotasi": latex = `\\[ R(P(${a},${b}), ${sudut}^{\\circ}) \\]`; break;
        case "dilatasi": 
            const dilA = ambilLatex("dilatasiA");
            const dilB = ambilLatex("dilatasiB");
            latex = `\\[ D(P(${dilA},${dilB}), ${a}) \\]`; 
            break;
        default: latex = "";
    }
    latexParameter.innerHTML = latex;
    if (window.MathJax) MathJax.typesetPromise([latexParameter]);
}


// ==========================================
// 10B. LANGKAH PENYELESAIAN DINAMIS (SESUAI TITIK PENGGUNA)
// ==========================================
function namaTitikKe(index) { return String.fromCharCode(65 + index); }

function bukaBlokLatex(baris) {
    return baris.map(b => `\\[ ${b} \\]`).join("");
}

function isiKerjaKosong(el) {
    if (!el) return;
    el.innerHTML = `<div class="contoh-title">Penyelesaian Titik Anda</div>
        <div class="rumus-kerja-empty">Buat titik di canvas lalu klik TERAPKAN untuk melihat langkah penyelesaiannya.</div>`;
}

function updateLangkahKerjaDinamis() {
    const idMap = {
        translasi: "kerjaTranslasi",
        refleksi: "kerjaRefleksi",
        rotasi: "kerjaRotasi",
        dilatasi: "kerjaDilatasi"
    };

    // Kosongkan semua dahulu
    Object.values(idMap).forEach(id => isiKerjaKosong(document.getElementById(id)));

    if (!transformasiAktif) return;
    const target = document.getElementById(idMap[transformasiAktif]);
    if (!target) return;

    if (stateAwalTransformasi.length === 0 || stateHasilTransformasi.length === 0) {
        isiKerjaKosong(target);
        return;
    }

    const a = ambilNilai("nilaiA");
    const b = ambilNilai("nilaiB");
    const sudut = ambilNilai("nilaiSudut");
    const k = ambilNilai("nilaiK");
    const aLatex = ambilLatex("nilaiA");
    const bLatex = ambilLatex("nilaiB");
    const sudutLatex = ambilLatex("nilaiSudut");
    const kLatex = ambilLatex("nilaiK");

    let blok = [];

    stateAwalTransformasi.forEach((titik, i) => {
        const hasil = stateHasilTransformasi[i];
        if (!hasil) return;
        const nama = namaTitikKe(i);
        const xL = formatPecahanLatex(titik.x), yL = formatPecahanLatex(titik.y);
        const xpL = formatPecahanLatex(hasil.x), ypL = formatPecahanLatex(hasil.y);
        let baris = [];

        if (transformasiAktif === "translasi") {
            baris.push(`${nama}(${xL},\\,${yL}),\\ \\ T=(${aLatex},${bLatex})`);
            baris.push(`${nama}'(${xL}{+}${bungkusLatex(a, aLatex)},\\;${yL}{+}${bungkusLatex(b, bLatex)}) = ${nama}'(${xpL},\\,${ypL})`);
        } else if (transformasiAktif === "refleksi") {
            if (sumbuRefleksiAktif === "x") {
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ \\text{cermin: sumbu-}X`);
                baris.push(`R_x(x,y) = (x,\\,-y)`);
                baris.push(`R_x(${xL},\\,${yL}) = (${xL},\\,-(${yL})) = ${nama}'(${xpL},\\,${ypL})`);
            } else if (sumbuRefleksiAktif === "y") {
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ \\text{cermin: sumbu-}Y`);
                baris.push(`R_y(x,y) = (-x,\\,y)`);
                baris.push(`R_y(${xL},\\,${yL}) = (-(${xL}),\\,${yL}) = ${nama}'(${xpL},\\,${ypL})`);
            } else if (sumbuRefleksiAktif === "x=k") {
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ \\text{cermin: } x=${kLatex}`);
                baris.push(`R_{x=k}(x,y) = (2k-x,\\,y)`);
                baris.push(`R_{x=${kLatex}}(${xL},\\,${yL}) = (2(${kLatex})-(${xL}),\\,${yL}) = ${nama}'(${xpL},\\,${ypL})`);
            } else if (sumbuRefleksiAktif === "y=k") {
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ \\text{cermin: } y=${kLatex}`);
                baris.push(`R_{y=k}(x,y) = (x,\\,2k-y)`);
                baris.push(`R_{y=${kLatex}}(${xL},\\,${yL}) = (${xL},\\,2(${kLatex})-(${yL})) = ${nama}'(${xpL},\\,${ypL})`);
            } else if (sumbuRefleksiAktif === "y=x") {
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ \\text{cermin: } y=x`);
                baris.push(`R_{y=x}(x,y) = (y,\\,x)`);
                baris.push(`R_{y=x}(${xL},\\,${yL}) = (${yL},\\,${xL}) = ${nama}'(${xpL},\\,${ypL})`);
            } else if (sumbuRefleksiAktif === "y=-x") {
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ \\text{cermin: } y=-x`);
                baris.push(`R_{y=-x}(x,y) = (-y,\\,-x)`);
                baris.push(`R_{y=-x}(${xL},\\,${yL}) = (-(${yL}),\\,-(${xL})) = ${nama}'(${xpL},\\,${ypL})`);
            } else if (sumbuRefleksiAktif === "o") {
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ \\text{cermin: titik } O(0,0)`);
                baris.push(`R_{O(0,0)}(x,y) = (-x,\\,-y)`);
                baris.push(`R_{O(0,0)}(${xL},\\,${yL}) = (-(${xL}),\\,-(${yL})) = ${nama}'(${xpL},\\,${ypL})`);
            }
        } else if (transformasiAktif === "rotasi") {
            const pusatDiOrigin = (a === 0 && b === 0);
            const sudutKhususValid = pusatDiOrigin && [90, -90, 180, 270, -270].includes(sudut);

            if (sudutKhususValid) {
                // Gunakan rumus khusus sesuai halaman materi (bukan rumus umum sudut theta)
                let formulaLabel, rumusUmum, xpRumus, ypRumus;
                if (sudut === 90) {
                    formulaLabel = "R_{90^{\\circ}}";
                    rumusUmum = `(-y,\\,x)`;
                    xpRumus = `-(${yL})`; ypRumus = `${xL}`;
                } else if (sudut === -90) {
                    formulaLabel = "R_{-90^{\\circ}}";
                    rumusUmum = `(y,\\,-x)`;
                    xpRumus = `${yL}`; ypRumus = `-(${xL})`;
                } else if (sudut === 180) {
                    formulaLabel = "R_{180^{\\circ}}";
                    rumusUmum = `(-x,\\,-y)`;
                    xpRumus = `-(${xL})`; ypRumus = `-(${yL})`;
                } else if (sudut === 270) {
                    formulaLabel = "R_{270^{\\circ}}";
                    rumusUmum = `(y,\\,-x)`;
                    xpRumus = `${yL}`; ypRumus = `-(${xL})`;
                } else if (sudut === -270) {
                    formulaLabel = "R_{-270^{\\circ}}";
                    rumusUmum = `(-y,\\,x)`;
                    xpRumus = `-(${yL})`; ypRumus = `${xL}`;
                }
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ \\theta = ${sudutLatex}^{\\circ},\\ \\ \\text{pusat}\\ O(0,0)`);
                baris.push(`${formulaLabel}(x,y) = ${rumusUmum}`);
                baris.push(`${formulaLabel}(${xL},\\,${yL}) = (${xpRumus},\\,${ypRumus}) = ${nama}'(${xpL},\\,${ypL})`);
            } else {
                // Sudut di luar 90, -90, 180, 270 (atau pusat bukan O(0,0)): gunakan rumus umum sudut theta
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ \\theta = ${sudutLatex}^{\\circ},\\ \\ \\text{pusat}\\ P(${aLatex},${bLatex})`);
                baris.push(`x' = (${xL}{-}${bungkusLatex(a, aLatex)})\\cos ${sudutLatex}^{\\circ} - (${yL}{-}${bungkusLatex(b, bLatex)})\\sin ${sudutLatex}^{\\circ} + ${aLatex} = ${xpL}`);
                baris.push(`y' = (${xL}{-}${bungkusLatex(a, aLatex)})\\sin ${sudutLatex}^{\\circ} + (${yL}{-}${bungkusLatex(b, bLatex)})\\cos ${sudutLatex}^{\\circ} + ${bLatex} = ${ypL}`);
                baris.push(`${nama}'(${xpL},\\,${ypL})`);
            }
        } else if (transformasiAktif === "dilatasi") {
            const pA = ambilNilai("dilatasiA"), pB = ambilNilai("dilatasiB");
            const pAL = ambilLatex("dilatasiA"), pBL = ambilLatex("dilatasiB");
            const pusatOrigin = (pA === 0 && pB === 0);
            if (pusatOrigin) {
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ k=${aLatex},\\ \\ \\text{pusat}\\ O(0,0)`);
                baris.push(`D_k(x,y) = (kx,\\,ky)`);
                baris.push(`D_{${aLatex}}(${xL},\\,${yL}) = (${aLatex} \\cdot ${xL},\\,${aLatex} \\cdot ${yL}) = ${nama}'(${xpL},\\,${ypL})`);
            } else {
                baris.push(`${nama}(${xL},\\,${yL}),\\ \\ k=${aLatex},\\ \\ \\text{pusat}\\ P(${pAL},${pBL})`);
                baris.push(`x' = ${pAL} + (${aLatex})(${xL}{-}${bungkusLatex(pA, pAL)}) = ${xpL}`);
                baris.push(`y' = ${pBL} + (${aLatex})(${yL}{-}${bungkusLatex(pB, pBL)}) = ${ypL}`);
                baris.push(`${nama}'(${xpL},\\,${ypL})`);
            }
        }

        blok.push(`<div class="kerja-point">${bukaBlokLatex(baris)}</div>`);
    });

    target.innerHTML = `<div class="contoh-title">Penyelesaian Titik Anda</div>` + blok.join("");
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([target]).catch(() => {});
    }
}


canvas.addEventListener("mousedown", (e) => {
    isDragging = true; startX = e.offsetX - originX; startY = e.offsetY - originY;
});
canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    originX = e.offsetX - startX; originY = e.offsetY - startY; drawCartesian();
});
canvas.addEventListener("mouseup", () => { isDragging = false; });
canvas.addEventListener("mouseleave", () => { isDragging = false; });

canvas.addEventListener("dblclick", (e) => {
    if (bentukSelesai) return;
    simpanStateUntukUndo();
    titikObjek.push(canvasToMath(e.offsetX, e.offsetY));
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    updateLatexKoordinat(); drawCartesian();
});

canvas.addEventListener("wheel", (e) => {
    e.preventDefault(); const zoomFactor = 1.1;
    if (e.deltaY < 0 && gridSize < 200) gridSize = Math.round(gridSize * zoomFactor);
    else if (e.deltaY > 0 && gridSize > 15) gridSize = Math.round(gridSize / zoomFactor);
    drawCartesian();
});

// ==========================================
// 11B. DUKUNGAN SENTUH (TOUCH) UNTUK HP: GESER, ZOOM PINCH, DAN TAP GANDA
// ==========================================
let touchMode = null;        // "pan" | "pinch"
let lastTouchX = 0, lastTouchY = 0;
let lastPinchDist = 0;
let lastTapTime = 0, lastTapX = 0, lastTapY = 0;

function ambilPosisiSentuh(touch) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
    };
}

function jarakDuaSentuh(t0, t1) {
    const dx = t0.clientX - t1.clientX;
    const dy = t0.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
        touchMode = "pan";
        const p = ambilPosisiSentuh(e.touches[0]);
        lastTouchX = p.x; lastTouchY = p.y;

        // Deteksi tap ganda (pengganti dblclick di perangkat sentuh)
        const sekarang = Date.now();
        const jarakTap = Math.hypot(p.x - lastTapX, p.y - lastTapY);
        if (sekarang - lastTapTime < 350 && jarakTap < 25) {
            if (!bentukSelesai) {
                simpanStateUntukUndo();
                titikObjek.push(canvasToMath(p.x, p.y));
                objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
                updateLatexKoordinat(); drawCartesian();
            }
            lastTapTime = 0;
            touchMode = null;
        } else {
            lastTapTime = sekarang; lastTapX = p.x; lastTapY = p.y;
        }
    } else if (e.touches.length === 2) {
        touchMode = "pinch";
        lastPinchDist = jarakDuaSentuh(e.touches[0], e.touches[1]);
    }
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (touchMode === "pan" && e.touches.length === 1) {
        const p = ambilPosisiSentuh(e.touches[0]);
        originX += p.x - lastTouchX;
        originY += p.y - lastTouchY;
        lastTouchX = p.x; lastTouchY = p.y;
        drawCartesian();
    } else if (touchMode === "pinch" && e.touches.length === 2) {
        const jarakBaru = jarakDuaSentuh(e.touches[0], e.touches[1]);
        if (lastPinchDist > 0) {
            const rasio = jarakBaru / lastPinchDist;
            const gridBaru = Math.round(gridSize * rasio);
            gridSize = Math.min(200, Math.max(15, gridBaru));
            drawCartesian();
        }
        lastPinchDist = jarakBaru;
    }
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
    if (e.touches.length === 0) {
        touchMode = null; lastPinchDist = 0;
    } else if (e.touches.length === 1) {
        touchMode = "pan";
        const p = ambilPosisiSentuh(e.touches[0]);
        lastTouchX = p.x; lastTouchY = p.y;
    }
}, { passive: false });

canvas.addEventListener("touchcancel", () => {
    touchMode = null; lastPinchDist = 0;
});

// ==========================================
// 12. CONTROL ACTIONS (TERAPKAN, RESET, SELESAI)
// ==========================================
document.getElementById("btnTerapkan")?.addEventListener("click", () => {
    const a = ambilNilai("nilaiA");
    const b = ambilNilai("nilaiB");
    const sudut = ambilNilai("nilaiSudut");
    const k = ambilNilai("nilaiK");

    if (titikObjek.length < 1) { alert("Buat objek atau titik terlebih dahulu"); return; }
    
    stateAwalTransformasi = titikObjek.map(t => ({ x: t.x, y: t.y }));

    switch (transformasiAktif) {
        case "translasi": translasi(a, b); break;
        case "refleksi":
            if (sumbuRefleksiAktif === "x") refleksiX();
            else if (sumbuRefleksiAktif === "y") refleksiY();
            else if (sumbuRefleksiAktif === "x=k") refleksiGarisXkeK(k);
            else if (sumbuRefleksiAktif === "y=k") refleksiGarisYkeK(k);
            else if (sumbuRefleksiAktif === "y=x") refleksiYX();
            else if (sumbuRefleksiAktif === "y=-x") refleksiYMinusX();
            else if (sumbuRefleksiAktif === "o") refleksiPusatO();
            break;
        case "rotasi": rotasi(sudut, a, b); break;
        case "dilatasi": 
            const pA = ambilNilai("dilatasiA");
            const pB = ambilNilai("dilatasiB");
            dilatasi(a, pA, pB); 
            break;
        default: alert("Pilih transformasi terlebih dahulu");
    }
    
    stateHasilTransformasi = objekHasil.map(t => ({ x: t.x, y: t.y }));
    updateLangkahKerjaDinamis();
});

document.getElementById("btnSelesaiBentuk")?.addEventListener("click", () => {
    bentukSelesai = titikObjek.length >= 3;
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    updateUndoRedoBtn();
    updateLatexKoordinat(); drawCartesian();
});

// UNDO
document.getElementById("btnUndo")?.addEventListener("click", () => {
    if (undoStack.length === 0 || bentukSelesai) return;
    redoStack.push(titikObjek.map(t => ({ x: t.x, y: t.y })));
    titikObjek = undoStack.pop();
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    updateUndoRedoBtn();
    updateLatexKoordinat(); drawCartesian();
});

// REDO
document.getElementById("btnRedo")?.addEventListener("click", () => {
    if (redoStack.length === 0 || bentukSelesai) return;
    undoStack.push(titikObjek.map(t => ({ x: t.x, y: t.y })));
    titikObjek = redoStack.pop();
    objekAwal = titikObjek.map(t => ({ x: t.x, y: t.y }));
    updateUndoRedoBtn();
    updateLatexKoordinat(); drawCartesian();
});

// Keyboard shortcut Ctrl+Z / Ctrl+Y
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        document.getElementById("btnUndo")?.click();
    } else if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        document.getElementById("btnRedo")?.click();
    }
});

document.getElementById("btnReset")?.addEventListener("click", () => {
    titikObjek = []; objekAwal = []; objekHasil = []; bentukSelesai = false; transformasiAktif = null;
    undoStack = []; redoStack = []; updateUndoRedoBtn();
    document.getElementById("btnLabel").textContent = "Pilih Transformasi";
    document.getElementById("nilaiA").value = 0; document.getElementById("nilaiB").value = 0;
    document.getElementById("nilaiSudut").value = 0;
    if (document.getElementById("nilaiK")) document.getElementById("nilaiK").value = 0;
    if (document.getElementById("dilatasiA")) document.getElementById("dilatasiA").value = 0;
    if (document.getElementById("dilatasiB")) document.getElementById("dilatasiB").value = 0;

    stateAwalTransformasi = []; stateHasilTransformasi = [];
    latexAwal.innerHTML = ""; latexHasil.innerHTML = ""; updateParameterLatex();
    setLabelLatex(document.getElementById("labelA"), "a\\ (\\text{sumbu-}x)");
    setLabelLatex(document.getElementById("labelB"), "b\\ (\\text{sumbu-}y)");

    document.getElementById("groupA").style.display = "flex";
    document.getElementById("groupB").style.display = "flex";
    document.getElementById("groupSudut").style.display = "none";
    document.getElementById("panelRefleksi").style.display = "none";
    document.getElementById("inputGarisK").style.display = "none";
    if (document.getElementById("groupPusatDilatasi")) document.getElementById("groupPusatDilatasi").style.display = "none";

    sumbuRefleksiAktif = "x";
    setLabelLatex(document.getElementById("labelRefleksi"), REFLEKSI_LATEX['x']);
    updateLangkahKerjaDinamis();
    updateSemuaPreview();
    drawCartesian();
});

// LAUNCHER ANIMASI via TOMBOL
btnAnimasi?.addEventListener("click", () => {
    const a = ambilNilai("nilaiA");
    const b = ambilNilai("nilaiB");
    const sudut = ambilNilai("nilaiSudut");
    const k = ambilNilai("nilaiK");
    let target = [];

    if (stateAwalTransformasi.length === 0) {
        if (transformasiAktif === "translasi") {
            target = hitungTranslasi(a, b);
        } else if (transformasiAktif === "refleksi") {
            if (sumbuRefleksiAktif === "x") target = hitungRefleksiX();
            else if (sumbuRefleksiAktif === "y") target = hitungRefleksiY();
            else if (sumbuRefleksiAktif === "x=k") target = hitungRefleksiGarisXkeK(k);
            else if (sumbuRefleksiAktif === "y=k") target = hitungRefleksiGarisYkeK(k);
            else if (sumbuRefleksiAktif === "y=x") target = hitungRefleksiYX();
            else if (sumbuRefleksiAktif === "y=-x") target = hitungRefleksiYMinusX();
            else if (sumbuRefleksiAktif === "o") target = hitungRefleksiPusatO();
        } else if (transformasiAktif === "rotasi") {
            target = hitungRotasi(sudut, a, b);
        } else if (transformasiAktif === "dilatasi") {
            const pA = ambilNilai("dilatasiA");
            const pB = ambilNilai("dilatasiB");
            target = hitungDilatasi(a, pA, pB);
        }
        if (target.length > 0) {
            stateAwalTransformasi = titikObjek.map(t => ({ x: t.x, y: t.y })); 
            stateHasilTransformasi = target;
            updateLangkahKerjaDinamis();
        }
    }
    animasiDariRiwayat(1500);
});

toggleGridElem?.addEventListener("change", drawCartesian);
toggleCoordsElem?.addEventListener("change", drawCartesian);

window.addEventListener("click", function(event) {
    const menu = document.getElementById("dropdownMenu");
    const btn = document.getElementById("btnDropdown");
    if (menu && btn && !btn.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove("show"); btn.classList.remove("active");
        const menuRef = document.getElementById("dropdownRefleksi");
        const btnRef = document.getElementById("btnDropdownRefleksi");
        if (menuRef && btnRef && !btnRef.contains(event.target) && !menuRef.contains(event.target)) {
            menuRef.classList.remove("show"); btnRef.classList.remove("active");
        }
    }
});

document.getElementById("nilaiK")?.addEventListener("input", () => { updateParameterLatex(); drawCartesian(); updateInputPreview("nilaiK", "previewK"); });
document.getElementById("nilaiA").addEventListener("input", () => { updateParameterLatex(); drawCartesian(); updateInputPreview("nilaiA", "previewA"); });
document.getElementById("nilaiB").addEventListener("input", () => { updateParameterLatex(); drawCartesian(); updateInputPreview("nilaiB", "previewB"); });
document.getElementById("nilaiSudut").addEventListener("input", () => { updateParameterLatex(); updateInputPreview("nilaiSudut", "previewSudut"); });
document.getElementById("dilatasiA")?.addEventListener("input", () => { updateParameterLatex(); drawCartesian(); updateInputPreview("dilatasiA", "previewDilatasiA"); });
document.getElementById("dilatasiB")?.addEventListener("input", () => { updateParameterLatex(); drawCartesian(); updateInputPreview("dilatasiB", "previewDilatasiB"); });
updateSemuaPreview();
updateUndoRedoBtn();

// INITIAL RUN
drawCartesian();

// ==========================================
// MOBILE: Resize canvas pixel agar pas di layar landscape HP
// Canvas internal pixel size disesuaikan dengan ukuran container nyata,
// sehingga tidak ada zoom/scale paksa yang membuatnya kelihatan kecil.
// ==========================================
function resizeCanvasMobile() {
    const isMobile = ('ontouchstart' in window) || window.innerWidth <= 960;
    const isLandscape = window.innerWidth > window.innerHeight;
    const container = document.querySelector('.container-kartesius');
    if (!container) return;

    if (isMobile && isLandscape) {
        // Tunggu CSS selesai layout
        requestAnimationFrame(() => {
            const rect = container.getBoundingClientRect();
            const cw = Math.floor(rect.width);
            const ch = Math.floor(rect.height);
            if (cw > 50 && ch > 50) {
                if (canvas.width !== cw || canvas.height !== ch) {
                    // Simpan posisi origin secara proporsional
                    const ox = originX / canvas.width;
                    const oy = originY / canvas.height;
                    canvas.width = cw;
                    canvas.height = ch;
                    originX = Math.round(ox * cw);
                    originY = Math.round(oy * ch);
                    drawCartesian();
                }
            }
        });
    } else {
        // Desktop: kembalikan ke ukuran default jika berubah
        if (canvas.width !== 700 || canvas.height !== 600) {
            const ox = originX / canvas.width;
            const oy = originY / canvas.height;
            canvas.width = 700;
            canvas.height = 600;
            originX = Math.round(ox * 700);
            originY = Math.round(oy * 600);
            drawCartesian();
        }
    }
}

resizeCanvasMobile();
window.addEventListener('resize', resizeCanvasMobile);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvasMobile, 350));
// ==========================================
// LATEX OVERLAY FOR INPUT FIELDS
// Shows the value as LaTeX inside the input box
// Hides while the input is focused so user can type normally
// ==========================================
function updateInputOverlay(inputId, overlayId) {
    const input = document.getElementById(inputId);
    const overlay = document.getElementById(overlayId);
    if (!input || !overlay) return;

    const val = input.value.trim();
    let latexStr = val || '0';

    // Konversi pecahan sederhana mis. 3/2 → \frac{3}{2}
    latexStr = latexStr.replace(/(-?\d+)\s*\/\s*(-?\d+)/g, '\\frac{$1}{$2}');
    // Konversi bilangan negatif mis. -3 → -3 (tetap, sudah valid LaTeX)

    overlay.innerHTML = `\\(${latexStr}\\)`;
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([overlay]).catch(() => {});
    }
}

function setupOverlayInput(inputId, overlayId) {
    const input = document.getElementById(inputId);
    const overlay = document.getElementById(overlayId);
    if (!input || !overlay) return;

    // Saat blur: update dan tampilkan LaTeX overlay
    input.addEventListener('blur', () => {
        updateInputOverlay(inputId, overlayId);
    });

    // Update live saat mengetik (opsional — untuk preview real-time)
    input.addEventListener('input', () => {
        updateInputOverlay(inputId, overlayId);
    });

    // Init: render nilai awal
    updateInputOverlay(inputId, overlayId);
}

// Wait for MathJax to be ready then set up all overlays
function initAllOverlays() {
    setupOverlayInput('nilaiA', 'overlayA');
    setupOverlayInput('nilaiB', 'overlayB');
    setupOverlayInput('nilaiSudut', 'overlaySudut');
    setupOverlayInput('nilaiK', 'overlayK');
    setupOverlayInput('dilatasiA', 'overlayDilatasiA');
    setupOverlayInput('dilatasiB', 'overlayDilatasiB');
}

if (window.MathJax) {
    MathJax.startup?.promise?.then(initAllOverlays) || setTimeout(initAllOverlays, 800);
} else {
    window.addEventListener('load', () => setTimeout(initAllOverlays, 800));
}