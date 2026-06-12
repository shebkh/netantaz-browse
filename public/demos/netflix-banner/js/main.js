const imageArray = [
    "./img/banner_group.png",
    "./img/banner_group2.png",
    "./img/banner_group3.png"
];

let currentIndex = 0;
let isAnimating = false;

document.querySelector(".banner").addEventListener("mouseenter", function () {
    if (isAnimating) return;

    isAnimating = true;
    const normalImage = document.querySelector(".normal-image");
    const hoverImage = document.querySelector(".hover-image");

    let middleChanged = false;

    const positions = [
        [-1500, -1000], [0, -1000],
        [-1500, -750], [0, -750],
        [-1500, -500], [0, -500],
        [-1500, -250], [0, -250],
        [-1500, 0], [0, 0],
        [-1800, -1000]
    ];

    let step = 0;

    function moveStep() {
        if (step < positions.length) {
            hoverImage.style.left = positions[step][0] + "px";
            hoverImage.style.top = positions[step][1] + "px";

            if (step === Math.floor(positions.length / 2) && !middleChanged) {
                currentIndex = (currentIndex + 1) % imageArray.length;
                normalImage.src = imageArray[currentIndex];
                middleChanged = true;
            }

            step++;
            setTimeout(moveStep, 100);
        } else {
            isAnimating = false;
        }
    }

    moveStep();
});
document.addEventListener("DOMContentLoaded", function () {
    const element = document.querySelector(".banner");
    if (element) {
        element.addEventListener("click", function () {
            window.open("https://smartbee.az", "_blank");
        });
    }
});