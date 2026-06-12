document.addEventListener("DOMContentLoaded", () => {
    const fg = document.querySelector(".fg_cn_1");
    const bg = document.querySelector(".bg_cn_1");

    let angle = 0;

    setInterval(() => {
        let xAxis = Math.sin(angle) * 20;
        let yAxis = Math.cos(angle) * 15;

        fg.style.transform = `rotateY(${xAxis / 2}deg) rotateX(${yAxis / 2}deg)`;
        bg.style.transform = `rotateY(${xAxis / 2}deg) rotateX(${yAxis / 2}deg)`;

        angle += 0.18; 
    }, 50);
});
