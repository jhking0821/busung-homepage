const header = document.querySelector(".header");

window.addEventListener("scroll",()=>{

    if(window.scrollY>60){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});

const hero=document.querySelector(".hero-content");

window.addEventListener("load",()=>{

    hero.classList.add("hero-show");

});

