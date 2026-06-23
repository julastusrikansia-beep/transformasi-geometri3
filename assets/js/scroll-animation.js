const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){

    const triggerPoint = window.innerHeight * 0.85;

    reveals.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;

        if(elementTop < triggerPoint){

            element.classList.add("show");

        }else{

            element.classList.remove("show");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);