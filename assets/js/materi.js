document.addEventListener("DOMContentLoaded", () => {

    const tombol = document.querySelectorAll(".card-materi");

    tombol.forEach(btn => {

        btn.addEventListener("click", function (e) {

            e.preventDefault();

            this.classList.add("klik");

            setTimeout(() => {
                window.location.href = this.href;
            }, 0);

        });

    });

});