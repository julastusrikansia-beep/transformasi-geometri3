// EFEK KLIK MENU
document.addEventListener("DOMContentLoaded", () => {

    const tombol = document.querySelectorAll(".btn-menu");

    tombol.forEach(btn => {

        btn.addEventListener("click", function (e) {

            e.preventDefault();

            this.classList.add("klik");

            setTimeout(() => {
                window.location.href = this.href;
            }, 250);

        });

    });

});



// BACKGROUND BINTANG & GEOMETRI
const canvas = document.getElementById("stars");

if (canvas) {

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars = [];
    const shapes = [];
    const comets = [];

    // Jumlah objek disesuaikan perangkat
    const isMobile = window.innerWidth < 768;

    const STAR_COUNT = isMobile ? 60 : 100;
    const SHAPE_COUNT = isMobile ? 4 : 8;


    // CLASS STAR
    class Star {

        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.size = Math.random() * 2 + 0.5;
            this.speed = Math.random() * 0.8 + 0.2;

            this.opacity = Math.random() * 0.8 + 0.2;
        }

        update() {

            this.y += this.speed;

            if (this.y > canvas.height + 5) {

                this.y = -5;
                this.x = Math.random() * canvas.width;

            }
        }

        draw() {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
            ctx.fill();

        }

    }


    // CLASS SHAPE
    class Shape {

        constructor() {
            this.reset();
        }

        reset() {

            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.size = Math.random() * 25 + 20;

            this.speed = Math.random() * 0.15 + 0.05;

            this.rotation = Math.random() * Math.PI * 2;

            this.rotationSpeed =
                (Math.random() - 0.5) * 0.004;

            this.type =
                Math.floor(Math.random() * 3);

            this.opacity =
                Math.random() * 0.15 + 0.05;
        }

        update() {

            this.y += this.speed;

            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 50) {

                this.y = -50;
                this.x = Math.random() * canvas.width;

            }

        }

        draw() {

            ctx.save();

            ctx.translate(
                this.x,
                this.y
            );

            ctx.rotate(this.rotation);

            ctx.strokeStyle =
    `rgba(0,220,255,${this.opacity})`;

            ctx.lineWidth = 1.5;

            switch (this.type) {

                // Persegi
                case 0:

                    ctx.strokeRect(
                        -this.size / 2,
                        -this.size / 2,
                        this.size,
                        this.size
                    );

                    break;

                // Segitiga
                case 1:

                    ctx.beginPath();

                    ctx.moveTo(
                        0,
                        -this.size / 2
                    );

                    ctx.lineTo(
                        -this.size / 2,
                        this.size / 2
                    );

                    ctx.lineTo(
                        this.size / 2,
                        this.size / 2
                    );

                    ctx.closePath();

                    ctx.stroke();

                    break;

                // Lingkaran
                case 2:

                    ctx.beginPath();

                    ctx.arc(
                        0,
                        0,
                        this.size / 2,
                        0,
                        Math.PI * 2
                    );

                    ctx.stroke();

                    break;
            }

            ctx.restore();

        }

    }

    // CLASS COMET (BINTANG JATUH)
class Comet {

    constructor() {
        this.reset(true);
    }

    reset(initial = false) {

    this.active = initial ? false : true;

    this.x = -150 - Math.random() * 200;
    this.y = Math.random() * 200;

    this.length = Math.random() * 100 + 80;

    this.speedX = Math.random() * 6 + 14;
    this.speedY = Math.random() * 2 + 2;

    this.opacity = Math.random() * 0.4 + 0.6;

    this.waitTime = Math.random() * 5000 + 3000;

    this.lastSpawn = performance.now();
}

    update(timestamp) {

        if (!this.active) {

            if (
                timestamp - this.lastSpawn >
                this.waitTime
            ) {

                this.active = true;


this.x = -150 - Math.random() * 200;
this.y = Math.random() * 200;

            }

            return;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (
            this.x > canvas.width + this.length ||
            this.y > canvas.height + this.length
        ) {

            this.active = false;

            this.waitTime =
                Math.random() * 5000 + 3000;

            this.lastSpawn = timestamp;
        }

    }

    draw() {

        if (!this.active) return;

        const gradient =
            ctx.createLinearGradient(
                this.x,
                this.y,
                this.x - this.length,
                this.y - this.length * 0.2
            );

        gradient.addColorStop(
            0,
            `rgba(255,255,255,${this.opacity})`
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        ctx.beginPath();

        ctx.moveTo(this.x, this.y);

        ctx.lineTo(
            this.x - this.length,
            this.y - this.length * 0.2
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // kepala comet
        ctx.beginPath();

        ctx.arc(
    this.x,
    this.y,
    3.5,
    0,
    Math.PI * 2
);

        ctx.fillStyle =
            `rgba(255,255,255,${this.opacity})`;

    ctx.shadowBlur = 12;
ctx.shadowColor = "white";

ctx.fill();

ctx.shadowBlur = 0;
    }

}

    // Generate Stars
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
    }

    // Generate Shapes
    for (let i = 0; i < SHAPE_COUNT; i++) {
        shapes.push(new Shape());
    }

// comet
const COMET_COUNT = 10;

for (let i = 0; i < COMET_COUNT; i++) {
    comets.push(new Comet());
}

    // ================================
    // RENDER LOOP (30 FPS)
    // ================================
    let lastTime = 0;
    const FPS = 30;
    const interval = 1000 / FPS;

    function animate(timestamp) {

        if (timestamp - lastTime < interval) {

            requestAnimationFrame(animate);
            return;

        }

        lastTime = timestamp;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        stars.forEach(star => {

            star.update();
            star.draw();

        });

        shapes.forEach(shape => {

            shape.update();
            shape.draw();

        });

        comets.forEach(comet => {

    comet.update(timestamp);
    comet.draw();

});

        requestAnimationFrame(animate);

    }

    requestAnimationFrame(animate);

}