document.addEventListener("DOMContentLoaded", () => {

    const counters =
        document.querySelectorAll(".count-number");


    counters.forEach(counter => {

        const target =
            Number(counter.dataset.count);


        const countUp =
            new countUp.CountUp(
                counter,
                target,
                {
                    duration: 2.5,
                    useGrouping: true,
                    separator: ","
                }
            );


        if (!countUp.error) {

            countUp.start();

        } else {

            console.error(
                countUp.error
            );

        }

    });

});