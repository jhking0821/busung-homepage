const steps=document.querySelectorAll(".step");

const processObserver=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{threshold:.2});

steps.forEach(step=>processObserver.observe(step));