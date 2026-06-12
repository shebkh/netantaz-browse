document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".fg_cn_1, .bg_cn_1");
    let angle = 0;
    let animationInterval;

    function startAnimation() {
        animationInterval = setInterval(() => {
            let yAxis = Math.cos(angle) * 40;
            elements.forEach(element => {
                element.style.transform = `rotateY(${yAxis / 2}deg)`;
            });
            angle += 0.18;
        }, 50);
    }

    function stopAnimation() {
        clearInterval(animationInterval);
    }

    startAnimation();

    const wrapper = document.querySelector(".wrapper");
    const wrapperFront = document.querySelector(".wrapper_front");
    const wrapperBack = document.querySelector(".wrapper_back");

    let isMouseDown = false;
    let startX = 0;
    let currentX = 0;
    let rotationY = 0;
    let initialRotation = 0;

    wrapperFront.style.zIndex = 1;
    wrapperBack.style.zIndex = 0;

    wrapper.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        startX = e.clientX;
        initialRotation = rotationY;
        wrapper.style.transition = "none";
        stopAnimation();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isMouseDown) return;

        currentX = e.clientX;
        const deltaX = currentX - startX;
        let newRotation = initialRotation + deltaX * 0.5;

        if (Math.abs(newRotation - initialRotation) >= 70) {
            finalizeRotation(newRotation);
            isMouseDown = false;
            startAnimation();
            return;
        }

        rotationY = newRotation;
        wrapper.style.transform = `perspective(800px) rotateY(${rotationY}deg)`;
    });

    document.addEventListener("mouseup", () => {
        if (isMouseDown) {
            isMouseDown = false;
            finalizeRotation(rotationY);
            startAnimation();
        }
    });

    document.addEventListener("mouseleave", () => {
        if (isMouseDown) {
            isMouseDown = false;
            finalizeRotation(rotationY);
            startAnimation();
        }
    });

    function finalizeRotation(finalRotation) {
        let rotationDiff = finalRotation - initialRotation;
        if (rotationDiff >= 70) {
            rotationY = initialRotation + 180;
        } else if (rotationDiff <= -70) {
            rotationY = initialRotation - 180;
        } else {
            rotationY = Math.round(finalRotation / 180) * 180;
        }

        if (rotationY % 360 === 0) {
            wrapperFront.style.zIndex = 1;
            wrapperBack.style.zIndex = 0;
        } else {
            wrapperFront.style.zIndex = 0;
            wrapperBack.style.zIndex = 1;
        }

        wrapper.style.transition = "transform 0.5s ease";
        wrapper.style.transform = `perspective(800px) rotateY(${rotationY}deg)`;
    }
});
