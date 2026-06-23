const DATA_SOAL_KUIS = {
  "mudah": [
    {
      "id": 1,
      "materi": "Translasi",
      "soal": "Titik $A(1, 1)$ ditranslasikan oleh vektor $T = \\begin{pmatrix} 5 \\\\ 4 \\end{pmatrix}$. Tentukan koordinat bayangan titik $A$.",
      "opsi": ["$(5,6)$", "$(6,5)$", "$(4,6)$", "$(7,3)$"],
      "jawabanIndex": 1,
      "pembahasan": "Rumus translasi: $A'(x+a,\\ y+b)$.<br>Substitusi nilai: $A'(1+5,\\ 1+4) = A'(6, 5)$."
    },
    {
      "id": 2,
      "materi": "Translasi",
      "soal": "Titik $B(1, -2)$ ditranslasikan oleh vektor $T = \\begin{pmatrix} 2 \\\\ 5 \\end{pmatrix}$. Hasil translasi titik $B$ adalah...",
      "opsi": ["$(3,3)$", "$(2,4)$", "$(3,7)$", "$(9,3)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus translasi: $B'(x+a,\\ y+b)$.<br>Substitusi nilai: $B'(1+2,\\ -2+5) = B'(3, 3)$."
    },
    {
      "id": 3,
      "materi": "Translasi",
      "soal": "Titik $C(-3, 5)$ ditranslasikan oleh vektor $T = \\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix}$. Koordinat bayangan titik $C$ adalah...",
      "opsi": ["$(1,3)$", "$(7,3)$", "$(1,-7)$", "$(-1,3)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus translasi: $C'(x+a,\\ y+b)$.<br>Substitusi nilai: $C'(-3+4,\\ 5+(-2)) = C'(1, 3)$."
    },
    {
      "id": 4,
      "materi": "Translasi",
      "soal": "Titik $D(0, 0)$ ditranslasikan oleh $T = \\begin{pmatrix} -3 \\\\ 7 \\end{pmatrix}$. Koordinat bayangannya adalah...",
      "opsi": ["$(-3,7)$", "$(3,-7)$", "$(7,-3)$", "$(0,0)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus translasi: $D'(x+a,\\ y+b)$.<br>Substitusi nilai: $D'(0+(-3),\\ 0+7) = D'(-3, 7)$."
    },
    {
      "id": 5,
      "materi": "Translasi",
      "soal": "Titik $E(4, 6)$ ditranslasikan oleh $T = \\begin{pmatrix} -4 \\\\ -6 \\end{pmatrix}$. Koordinat bayangannya adalah...",
      "opsi": ["$(0,0)$", "$(8,12)$", "$(-4,-6)$", "$(4,6)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus translasi: $E'(x+a,\\ y+b)$.<br>Substitusi nilai: $E'(4+(-4),\\ 6+(-6)) = E'(0, 0)$.<br>Titik kembali ke pusat koordinat karena vektor translasi berlawanan dengan posisi titik asal."
    },
    {
      "id": 6,
      "materi": "Translasi",
      "soal": "Titik $F(2, -5)$ ditranslasikan oleh $T = \\begin{pmatrix} 3 \\\\ 8 \\end{pmatrix}$. Koordinat bayangan $F$ adalah...",
      "opsi": ["$(5,3)$", "$(5,-3)$", "$(-1,-13)$", "$(3,-5)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus translasi: $F'(x+a,\\ y+b)$.<br>Substitusi nilai: $F'(2+3,\\ -5+8) = F'(5, 3)$."
    },
    {
      "id": 7,
      "materi": "Translasi",
      "soal": "Titik $G(-4, -3)$ ditranslasikan oleh $T = \\begin{pmatrix} 6 \\\\ 3 \\end{pmatrix}$. Koordinat bayangan $G$ adalah...",
      "opsi": ["$(2,0)$", "$(-2,0)$", "$(0,2)$", "$(6,3)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus translasi: $G'(x+a,\\ y+b)$.<br>Substitusi nilai: $G'(-4+6,\\ -3+3) = G'(2, 0)$."
    },
    {
      "id": 8,
      "materi": "Refleksi",
      "soal": "Titik $P(4, -2)$ dicerminkan terhadap sumbu-$x$. Hasil pencerminannya adalah...",
      "opsi": ["$(-4,-2)$", "$(-4,2)$", "$(4,2)$", "$(2,4)$"],
      "jawabanIndex": 2,
      "pembahasan": "Rumus refleksi terhadap sumbu-$x$: $(x, y) \\to (x, -y)$.<br>Substitusi: $(4, -2) \\to (4, -(-2)) = P'(4, 2)$."
    },
    {
      "id": 9,
      "materi": "Refleksi",
      "soal": "Titik $Q(-5, 3)$ dicerminkan terhadap sumbu-$y$. Hasil refleksinya adalah...",
      "opsi": ["$(5,3)$", "$(-5,-3)$", "$(3,5)$", "$(5,-3)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap sumbu-$y$: $(x, y) \\to (-x, y)$.<br>Substitusi: $(-5, 3) \\to (-(-5), 3) = Q'(5, 3)$."
    },
    {
      "id": 10,
      "materi": "Refleksi",
      "soal": "Titik $R(2, -6)$ dicerminkan terhadap sumbu-$x$. Koordinat bayangannya adalah...",
      "opsi": ["$(-2,-6)$", "$(2,6)$", "$(-2,6)$", "$(6,2)$"],
      "jawabanIndex": 1,
      "pembahasan": "Rumus refleksi terhadap sumbu-$x$: $(x, y) \\to (x, -y)$.<br>Substitusi: $(2, -6) \\to (2, -(-6)) = R'(2, 6)$."
    },
    {
      "id": 11,
      "materi": "Refleksi",
      "soal": "Titik $M(7, 3)$ dicerminkan terhadap sumbu-$y$. Koordinat bayangannya adalah...",
      "opsi": ["$(-7,3)$", "$(7,-3)$", "$(-7,-3)$", "$(3,7)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap sumbu-$y$: $(x, y) \\to (-x, y)$.<br>Substitusi: $(7, 3) \\to (-7, 3) = M'(-7, 3)$."
    },
    {
      "id": 12,
      "materi": "Refleksi",
      "soal": "Titik $S(0, 5)$ dicerminkan terhadap sumbu-$x$. Koordinat bayangannya adalah...",
      "opsi": ["$(0,-5)$", "$(5,0)$", "$(0,5)$", "$(-5,0)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap sumbu-$x$: $(x, y) \\to (x, -y)$.<br>Substitusi: $(0, 5) \\to (0, -5) = S'(0, -5)$."
    },
    {
      "id": 13,
      "materi": "Rotasi",
      "soal": "Titik $G(4, -2)$ dirotasikan sebesar $270°$ berlawanan arah jarum jam terhadap pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(-2,-4)$", "$(2,4)$", "$(-2,4)$", "$(2,-4)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus rotasi $270°$ berlawanan jarum jam terhadap $O(0,0)$: $(x, y) \\to (y, -x)$.<br>Substitusi: $(4, -2) \\to (-2, -4) = G'(-2, -4)$."
    },
    {
      "id": 14,
      "materi": "Rotasi",
      "soal": "Titik $N(2, 4)$ dirotasikan sebesar $90°$ berlawanan arah jarum jam terhadap pusat $O(0,0)$. Hasil rotasinya adalah...",
      "opsi": ["$(-4,2)$", "$(4,-2)$", "$(2,-4)$", "$(4,2)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus rotasi $90°$ berlawanan jarum jam terhadap $O(0,0)$: $(x, y) \\to (-y, x)$.<br>Substitusi: $(2, 4) \\to (-4, 2) = N'(-4, 2)$."
    },
    {
      "id": 15,
      "materi": "Rotasi",
      "soal": "Titik $K(2, 5)$ dirotasikan sebesar $90°$ searah jarum jam terhadap pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(5,-2)$", "$(-5,2)$", "$(2,-5)$", "$(-2,-5)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus rotasi $90°$ searah jarum jam (atau $-90°$) terhadap $O(0,0)$: $(x, y) \\to (y, -x)$.<br>Substitusi: $(2, 5) \\to (5, -2) = K'(5, -2)$."
    },
    {
      "id": 16,
      "materi": "Rotasi",
      "soal": "Titik $L(3, 0)$ dirotasikan sebesar $180°$ terhadap pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(-3,0)$", "$(0,-3)$", "$(0,3)$", "$(3,0)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus rotasi $180°$ terhadap $O(0,0)$: $(x, y) \\to (-x, -y)$.<br>Substitusi: $(3, 0) \\to (-3, 0) = L'(-3, 0)$."
    },
    {
      "id": 17,
      "materi": "Rotasi",
      "soal": "Titik $H(5, 3)$ dirotasikan sebesar $180°$ terhadap pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(-5,-3)$", "$(5,-3)$", "$(-5,3)$", "$(3,5)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus rotasi $180°$ terhadap $O(0,0)$: $(x, y) \\to (-x, -y)$.<br>Substitusi: $(5, 3) \\to (-5, -3) = H'(-5, -3)$."
    },
    {
      "id": 18,
      "materi": "Dilatasi",
      "soal": "Titik $S(2, 3)$ didilatasi dengan faktor skala $k = 2$ terhadap pusat $O(0,0)$. Hasil dilatasinya adalah...",
      "opsi": ["$(4,6)$", "$(2,6)$", "$(6,4)$", "$(1,1.5)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus dilatasi terhadap $O(0,0)$: $D_k(x, y) = (kx,\\, ky)$.<br>Substitusi dengan $k = 2$: $S'(2 \\times 2,\\ 3 \\times 2) = S'(4, 6)$."
    },
    {
      "id": 19,
      "materi": "Dilatasi",
      "soal": "Titik $T(-1, 4)$ didilatasi dengan faktor skala $k = 3$ terhadap pusat $O(0,0)$. Hasil dilatasinya adalah...",
      "opsi": ["$(-1,12)$", "$(-3,12)$", "$(3,12)$", "$(-3,4)$"],
      "jawabanIndex": 1,
      "pembahasan": "Rumus dilatasi terhadap $O(0,0)$: $D_k(x, y) = (kx,\\, ky)$.<br>Substitusi dengan $k = 3$: $T'(-1 \\times 3,\\ 4 \\times 3) = T'(-3, 12)$."
    },
    {
      "id": 20,
      "materi": "Dilatasi",
      "soal": "Titik $U(5, 10)$ didilatasi dengan faktor skala $k = \\frac{1}{5}$ terhadap pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(1,2)$", "$(25,50)$", "$(5,2)$", "$(1,10)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus dilatasi terhadap $O(0,0)$: $D_k(x, y) = (kx,\\, ky)$.<br>Substitusi dengan $k = \\frac{1}{5}$: $U'\\left(5 \\times \\frac{1}{5},\\ 10 \\times \\frac{1}{5}\\right) = U'(1, 2)$."
    },
    {
      "id": 21,
      "materi": "Dilatasi",
      "soal": "Titik $V(6, -4)$ didilatasi dengan faktor skala $k = 2$ terhadap pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(12,-8)$", "$(3,-2)$", "$(8,-4)$", "$(-12,8)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus dilatasi terhadap $O(0,0)$: $D_k(x, y) = (kx,\\, ky)$.<br>Substitusi dengan $k = 2$: $V'(6 \\times 2,\\ -4 \\times 2) = V'(12, -8)$."
    }
  ],
  "sedang": [
    {
      "id": 1,
      "materi": "Refleksi Garis $x = k$",
      "soal": "Titik $A(3, 5)$ dicerminkan terhadap garis $x = 2$. Koordinat bayangan titik $A$ adalah...",
      "opsi": ["$(1,5)$", "$(5,5)$", "$(-1,5)$", "$(2,5)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap garis $x = k$: $(x, y) \\to (2k - x,\\, y)$.<br>Substitusi $k = 2$, $x = 3$: $x' = 2(2) - 3 = 1$, $y' = 5$.<br>Bayangan: $A'(1, 5)$."
    },
    {
      "id": 2,
      "materi": "Refleksi Garis $y = k$",
      "soal": "Titik $B(-2, 4)$ dicerminkan terhadap garis $y = 1$. Koordinat bayangan titik $B$ adalah...",
      "opsi": ["$(-2,-2)$", "$(-2,2)$", "$(6,4)$", "$(2,1)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap garis $y = k$: $(x, y) \\to (x,\\, 2k - y)$.<br>Substitusi $k = 1$, $y = 4$: $x' = -2$, $y' = 2(1) - 4 = -2$.<br>Bayangan: $B'(-2, -2)$."
    },
    {
      "id": 3,
      "materi": "Refleksi Garis $y = x$",
      "soal": "Titik $C(5, -3)$ dicerminkan terhadap garis $y = x$. Koordinat bayangan titik $C$ adalah...",
      "opsi": ["$(-3,5)$", "$(3,-5)$", "$(-5,3)$", "$(5,3)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap garis $y = x$: $(x, y) \\to (y,\\, x)$.<br>Substitusi: $(5, -3) \\to (-3, 5) = C'(-3, 5)$."
    },
    {
      "id": 4,
      "materi": "Rotasi Pusat $O(0,0)$",
      "soal": "Titik $D(2, 7)$ dirotasikan sebesar $180°$ terhadap pusat $O(0,0)$. Koordinat bayangan titik $D$ adalah...",
      "opsi": ["$(-2,-7)$", "$(-7,-2)$", "$(2,-7)$", "$(-2,7)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus rotasi $180°$ terhadap $O(0,0)$: $(x, y) \\to (-x,\\, -y)$.<br>Substitusi: $(2, 7) \\to (-2, -7) = D'(-2, -7)$."
    },
    {
      "id": 5,
      "materi": "Dilatasi Pusat $O(0,0)$",
      "soal": "Titik $E(-6, 9)$ didilatasi terhadap pusat $O(0,0)$ dengan faktor skala $k = \\frac{1}{3}$. Koordinat bayangan titik $E$ adalah...",
      "opsi": ["$(-2,3)$", "$(2,-3)$", "$(-18,27)$", "$(-2,9)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus dilatasi terhadap $O(0,0)$: $D_k(x, y) = (kx,\\, ky)$.<br>Substitusi dengan $k = \\frac{1}{3}$: $E'\\left(-6 \\times \\frac{1}{3},\\ 9 \\times \\frac{1}{3}\\right) = E'(-2, 3)$."
    },
    {
      "id": 6,
      "materi": "Translasi",
      "soal": "Titik $F(-3, 4)$ ditranslasikan menjadi $F'(2, 1)$. Vektor translasi yang digunakan adalah...",
      "opsi": ["$\\begin{pmatrix}5\\\\-3\\end{pmatrix}$", "$\\begin{pmatrix}-5\\\\3\\end{pmatrix}$", "$\\begin{pmatrix}2\\\\1\\end{pmatrix}$", "$\\begin{pmatrix}5\\\\3\\end{pmatrix}$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus mencari vektor translasi: $\\begin{pmatrix}a\\\\b\\end{pmatrix} = \\begin{pmatrix}x'-x\\\\y'-y\\end{pmatrix}$.<br>Substitusi: $a = 2-(-3) = 5$, $b = 1-4 = -3$.<br>Vektor translasi: $\\begin{pmatrix}5\\\\-3\\end{pmatrix}$."
    },
    {
      "id": 7,
      "materi": "Rotasi Pusat $O(0,0)$",
      "soal": "Titik $G(4, -2)$ dirotasikan sebesar $270°$ berlawanan arah jarum jam terhadap pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(-2,-4)$", "$(2,4)$", "$(-2,4)$", "$(2,-4)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus rotasi $270°$ berlawanan jarum jam terhadap $O(0,0)$: $(x, y) \\to (y,\\, -x)$.<br>Substitusi: $(4, -2) \\to (-2, -4) = G'(-2, -4)$."
    },
    {
      "id": 8,
      "materi": "Dilatasi Pusat $O(0,0)$",
      "soal": "Titik $H(8, -4)$ didilatasi dengan faktor skala $k = \\frac{1}{2}$ terhadap pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(4,-2)$", "$(16,-8)$", "$(4,2)$", "$(-4,-2)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus dilatasi terhadap $O(0,0)$: $D_k(x, y) = (kx,\\, ky)$.<br>Substitusi dengan $k = \\frac{1}{2}$: $H'\\left(8 \\times \\frac{1}{2},\\ -4 \\times \\frac{1}{2}\\right) = H'(4, -2)$."
    },
    {
      "id": 9,
      "materi": "Refleksi Garis $y = -x$",
      "soal": "Titik $I(3, -5)$ dicerminkan terhadap garis $y = -x$. Koordinat bayangan titik $I$ adalah...",
      "opsi": ["$(5,-3)$", "$(-5,3)$", "$(3,5)$", "$(-3,-5)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap garis $y = -x$: $(x, y) \\to (-y,\\, -x)$.<br>Substitusi: $(3, -5) \\to (-(-5), -3) = (5, -3) = I'(5, -3)$."
    },
    {
      "id": 10,
      "materi": "Refleksi Titik Pusat $O$",
      "soal": "Titik $J(-4, 6)$ dicerminkan terhadap titik pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(4,-6)$", "$(-4,-6)$", "$(6,-4)$", "$(-6,4)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap titik pusat $O(0,0)$: $(x, y) \\to (-x,\\, -y)$.<br>Substitusi: $(-4, 6) \\to (4, -6) = J'(4, -6)$."
    },
    {
      "id": 11,
      "materi": "Translasi",
      "soal": "Titik $K(5, -3)$ ditranslasikan menjadi $K'(-1, 4)$. Vektor translasi yang digunakan adalah...",
      "opsi": ["$\\begin{pmatrix}-6\\\\7\\end{pmatrix}$", "$\\begin{pmatrix}6\\\\-7\\end{pmatrix}$", "$\\begin{pmatrix}-6\\\\-7\\end{pmatrix}$", "$\\begin{pmatrix}4\\\\1\\end{pmatrix}$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus mencari vektor translasi: $\\begin{pmatrix}a\\\\b\\end{pmatrix} = \\begin{pmatrix}x'-x\\\\y'-y\\end{pmatrix}$.<br>Substitusi: $a = -1-5 = -6$, $b = 4-(-3) = 7$.<br>Vektor translasi: $\\begin{pmatrix}-6\\\\7\\end{pmatrix}$."
    },
    {
      "id": 12,
      "materi": "Dilatasi Pusat $P(a,b)$",
      "soal": "Titik $L(4, 6)$ didilatasi dengan pusat $P(2, 3)$ dan faktor skala $k = 2$. Koordinat bayangannya adalah...",
      "opsi": ["$(6,9)$", "$(8,12)$", "$(2,3)$", "$(4,6)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus dilatasi terhadap pusat $P(a, b)$: $x' = a + k(x-a)$, $y' = b + k(y-b)$.<br>Substitusi $P(2,3)$, $k = 2$:<br>$x' = 2 + 2(4-2) = 2 + 4 = 6$<br>$y' = 3 + 2(6-3) = 3 + 6 = 9$<br>Bayangan: $L'(6, 9)$."
    },
    {
      "id": 13,
      "materi": "Refleksi Garis $x = k$",
      "soal": "Titik $M(1, 7)$ dicerminkan terhadap garis $x = 4$. Koordinat bayangan titik $M$ adalah...",
      "opsi": ["$(7,7)$", "$(5,7)$", "$(3,7)$", "$(8,7)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap garis $x = k$: $(x, y) \\to (2k - x,\\, y)$.<br>Substitusi $k = 4$, $x = 1$: $x' = 2(4) - 1 = 7$, $y' = 7$.<br>Bayangan: $M'(7, 7)$."
    },
    {
      "id": 14,
      "materi": "Rotasi Pusat $O(0,0)$",
      "soal": "Titik $N(-3, 5)$ dirotasikan sebesar $90°$ berlawanan arah jarum jam terhadap pusat $O(0,0)$. Koordinat bayangannya adalah...",
      "opsi": ["$(-5,-3)$", "$(5,3)$", "$(-5,3)$", "$(5,-3)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus rotasi $90°$ berlawanan jarum jam terhadap $O(0,0)$: $(x, y) \\to (-y,\\, x)$.<br>Substitusi: $(-3, 5) \\to (-5, -3) = N'(-5, -3)$."
    },
    {
      "id": 15,
      "materi": "Dilatasi Pusat $P(a,b)$",
      "soal": "Titik $O(6, 4)$ didilatasi dengan pusat $P(2, 2)$ dan faktor skala $k = 3$. Koordinat bayangannya adalah...",
      "opsi": ["$(14,8)$", "$(18,12)$", "$(8,6)$", "$(4,2)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus dilatasi terhadap pusat $P(a, b)$: $x' = a + k(x-a)$, $y' = b + k(y-b)$.<br>Substitusi $P(2,2)$, $k = 3$:<br>$x' = 2 + 3(6-2) = 2 + 12 = 14$<br>$y' = 2 + 3(4-2) = 2 + 6 = 8$<br>Bayangan: $O'(14, 8)$."
    },
    {
      "id": 16,
      "materi": "Refleksi Garis $y = k$",
      "soal": "Titik $P(5, -1)$ dicerminkan terhadap garis $y = 3$. Koordinat bayangan titik $P$ adalah...",
      "opsi": ["$(5,7)$", "$(5,5)$", "$(5,-7)$", "$(5,1)$"],
      "jawabanIndex": 0,
      "pembahasan": "Rumus refleksi terhadap garis $y = k$: $(x, y) \\to (x,\\, 2k - y)$.<br>Substitusi $k = 3$, $y = -1$: $x' = 5$, $y' = 2(3) - (-1) = 6 + 1 = 7$.<br>Bayangan: $P'(5, 7)$."
    }
  ],
  "sulit": [
    {
      "id": 1,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $P(1, 2)$ ditranslasikan oleh $T = \\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}$ kemudian dilanjutkan refleksi terhadap sumbu-$x$. Bayangan akhir titik $P$ adalah...",
      "opsi": ["$(4,4)$", "$(4,-4)$", "$(-4,4)$", "$(-4,-4)$"],
      "jawabanIndex": 1,
      "pembahasan": "<b>Tahap 1 — Translasi</b> $(x,y) \\to (x+a, y+b)$:<br>$P(1,2) \\to P'(1+3,\\ 2+2) = P'(4, 4)$<br><b>Tahap 2 — Refleksi sumbu-$x$</b> $(x,y) \\to (x,-y)$:<br>$P'(4, 4) \\to P''(4, -4)$"
    },
    {
      "id": 2,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $Q(2, -1)$ dicerminkan terhadap sumbu-$y$, kemudian dirotasikan $90°$ berlawanan arah jarum jam terhadap pusat $O(0,0)$. Bayangan akhir titik $Q$ adalah...",
      "opsi": ["$(1,-2)$", "$(-1,-2)$", "$(2,1)$", "$(-2,1)$"],
      "jawabanIndex": 0,
      "pembahasan": "<b>Tahap 1 — Refleksi sumbu-$y$</b> $(x,y) \\to (-x, y)$:<br>$Q(2, -1) \\to Q'(-2, -1)$<br><b>Tahap 2 — Rotasi $+90°$</b> $(x,y) \\to (-y, x)$:<br>$Q'(-2, -1) \\to Q''(1, -2)$"
    },
    {
      "id": 3,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $R(3, 4)$ didilatasi dengan faktor skala $k = 2$ terhadap pusat $O(0,0)$, kemudian dicerminkan terhadap garis $y = -x$. Bayangan akhir titik $R$ adalah...",
      "opsi": ["$(-8,-6)$", "$(-6,-8)$", "$(8,6)$", "$(-8,6)$"],
      "jawabanIndex": 0,
      "pembahasan": "<b>Tahap 1 — Dilatasi</b> $D_k(x,y) = (kx, ky)$ dengan $k=2$:<br>$R(3, 4) \\to R'(6, 8)$<br><b>Tahap 2 — Refleksi garis $y=-x$</b> $(x,y) \\to (-y, -x)$:<br>$R'(6, 8) \\to R''(-8, -6)$"
    },
    {
      "id": 4,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $S(2, 3)$ dirotasikan $180°$ terhadap pusat $O(0,0)$, kemudian ditranslasikan oleh vektor $T = \\begin{pmatrix} 4 \\\\ -1 \\end{pmatrix}$. Bayangan akhir titik $S$ adalah...",
      "opsi": ["$(2,-4)$", "$(-2,4)$", "$(6,2)$", "$(2,-2)$"],
      "jawabanIndex": 0,
      "pembahasan": "<b>Tahap 1 — Rotasi $180°$</b> $(x,y) \\to (-x,-y)$:<br>$S(2, 3) \\to S'(-2, -3)$<br><b>Tahap 2 — Translasi</b> $(x,y) \\to (x+a, y+b)$:<br>$S'(-2, -3) \\to S''(-2+4,\\ -3+(-1)) = S''(2, -4)$"
    },
    {
      "id": 5,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $T(-1, 2)$ dicerminkan terhadap garis $y = x$, kemudian didilatasi dengan faktor skala $k = 2$ terhadap pusat $O(0,0)$. Bayangan akhir titik $T$ adalah...",
      "opsi": ["$(4,-2)$", "$(-2,4)$", "$(2,-4)$", "$(-4,2)$"],
      "jawabanIndex": 0,
      "pembahasan": "<b>Tahap 1 — Refleksi garis $y=x$</b> $(x,y) \\to (y, x)$:<br>$T(-1, 2) \\to T'(2, -1)$<br><b>Tahap 2 — Dilatasi</b> $D_k(x,y) = (kx, ky)$ dengan $k=2$:<br>$T'(2, -1) \\to T''(4, -2)$"
    },
    {
      "id": 6,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $U(3, 1)$ dirotasikan $90°$ berlawanan arah jarum jam terhadap $O(0,0)$, kemudian ditranslasikan oleh $T = \\begin{pmatrix} 2 \\\\ -2 \\end{pmatrix}$. Bayangan akhir adalah...",
      "opsi": ["$(1,1)$", "$(-1,3)$", "$(1,-2)$", "$(-1,-2)$"],
      "jawabanIndex": 0,
      "pembahasan": "<b>Tahap 1 — Rotasi $+90°$</b> $(x,y) \\to (-y, x)$:<br>$U(3, 1) \\to U'(-1, 3)$<br><b>Tahap 2 — Translasi</b> $(x,y) \\to (x+2, y-2)$:<br>$U'(-1, 3) \\to U''(-1+2,\\ 3-2) = U''(1, 1)$"
    },
    {
      "id": 7,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $V(0, 4)$ dicerminkan terhadap sumbu-$x$, kemudian dirotasikan $90°$ berlawanan arah jarum jam terhadap $O(0,0)$. Bayangan akhirnya adalah...",
      "opsi": ["$(4,0)$", "$(0,4)$", "$(-4,0)$", "$(0,-4)$"],
      "jawabanIndex": 0,
      "pembahasan": "<b>Tahap 1 — Refleksi sumbu-$x$</b> $(x,y) \\to (x,-y)$:<br>$V(0, 4) \\to V'(0, -4)$<br><b>Tahap 2 — Rotasi $+90°$</b> $(x,y) \\to (-y, x)$:<br>$V'(0, -4) \\to V''(4, 0)$"
    },
    {
      "id": 8,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $W(2, 3)$ didilatasi dengan $k=2$ terhadap pusat $P(1,1)$, kemudian dicerminkan terhadap sumbu-$y$. Bayangan akhirnya adalah...",
      "opsi": ["$(-3,5)$", "$(3,5)$", "$(-3,-5)$", "$(3,-5)$"],
      "jawabanIndex": 0,
      "pembahasan": "<b>Tahap 1 — Dilatasi pusat $P(1,1)$, $k=2$</b>: $x' = a+k(x-a)$, $y' = b+k(y-b)$:<br>$x' = 1+2(2-1) = 3$, $y' = 1+2(3-1) = 5$<br>$W \\to W'(3, 5)$<br><b>Tahap 2 — Refleksi sumbu-$y$</b> $(x,y) \\to (-x, y)$:<br>$W'(3, 5) \\to W''(-3, 5)$"
    },
    {
      "id": 9,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $X(4, 0)$ dirotasikan $90°$ searah jarum jam terhadap $O(0,0)$, kemudian dicerminkan terhadap garis $y = x$. Bayangan akhirnya adalah...",
      "opsi": ["$(0,-4)$", "$(-4,0)$", "$(4,0)$", "$(0,4)$"],
      "jawabanIndex": 1,
      "pembahasan": "<b>Tahap 1 — Rotasi $-90°$ (searah jarum jam)</b> $(x,y) \\to (y,-x)$:<br>$X(4, 0) \\to X'(0, -4)$<br><b>Tahap 2 — Refleksi garis $y=x$</b> $(x,y) \\to (y, x)$:<br>$X'(0, -4) \\to X''(-4, 0)$"
    },
    {
      "id": 10,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $Y(5, 2)$ ditranslasikan oleh $T = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$, kemudian dicerminkan terhadap sumbu-$y$. Bayangan akhirnya adalah...",
      "opsi": ["$(2,6)$", "$(-2,6)$", "$(-2,-6)$", "$(2,-6)$"],
      "jawabanIndex": 0,
      "pembahasan": "<b>Tahap 1 — Translasi</b> $(x,y) \\to (x+a, y+b)$:<br>$Y(5, 2) \\to Y'(5+(-3),\\ 2+4) = Y'(2, 6)$<br><b>Tahap 2 — Refleksi sumbu-$y$</b> $(x,y) \\to (-x, y)$:<br>$Y'(2, 6) \\to Y''(-2, 6)$"
    },
    {
      "id": 11,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $Z(3, -2)$ dicerminkan terhadap garis $y = -x$, kemudian dirotasikan $180°$ terhadap $O(0,0)$. Bayangan akhirnya adalah...",
      "opsi": ["$(-2,-3)$", "$(-2,3)$", "$(2,-3)$", "$(2,3)$"],
      "jawabanIndex": 1,
      "pembahasan": "<b>Tahap 1 — Refleksi garis $y=-x$</b> $(x,y) \\to (-y,-x)$:<br>$Z(3, -2) \\to Z'(2, -3)$<br><b>Tahap 2 — Rotasi $180°$</b> $(x,y) \\to (-x,-y)$:<br>$Z'(2, -3) \\to Z''(-2, 3)$"
    },
    {
      "id": 12,
      "materi": "Komposisi Transformasi",
      "soal": "Titik $A(1, -3)$ didilatasi dengan $k = 3$ terhadap $O(0,0)$, kemudian ditranslasikan oleh $T = \\begin{pmatrix} -2 \\\\ 5 \\end{pmatrix}$. Bayangan akhirnya adalah...",
      "opsi": ["$(1,-4)$", "$(-1,4)$", "$(1,4)$", "$(-1,-4)$"],
      "jawabanIndex": 0,
      "pembahasan": "<b>Tahap 1 — Dilatasi</b> $D_k(x,y) = (kx, ky)$ dengan $k=3$:<br>$A(1, -3) \\to A'(3, -9)$<br><b>Tahap 2 — Translasi</b> $(x,y) \\to (x-2, y+5)$:<br>$A'(3, -9) \\to A''(3-2,\\ -9+5) = A''(1, -4)$"
    }
  ]
};
