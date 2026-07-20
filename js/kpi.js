const counters=document.querySelectorAll("[data-count]");

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            const el=entry.target;

            const target=+el.dataset.count;

            let count=0;

            const speed=target/80;

            const update=()=>{

                count+=speed;

                if(count<target){

                    el.innerText=Math.floor(count);

                    requestAnimationFrame(update);

                }else{

                    el.innerText=target+"+";

                }

            };

            update();

            observer.unobserve(el);

        }

    });

});

counters.forEach(c=>observer.observe(c));