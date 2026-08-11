const counters = document.querySelectorAll("[data-count]");

if (counters.length > 0) {

    const kpiObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = Number(el.dataset.count);

            let count = 0;
            const speed = target / 80;

            const update = () => {

                count += speed;

                if (count < target) {

                    el.innerText = Math.floor(count);
                    requestAnimationFrame(update);

                } else {

                    el.innerText = target + "+";

                }

            };

            update();

            observer.unobserve(el);

        });

    });

    counters.forEach(counter => {
        kpiObserver.observe(counter);
    });

}