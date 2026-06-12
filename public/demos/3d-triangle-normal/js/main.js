document.addEventListener("DOMContentLoaded", () => {
    const outerCont = document.querySelector(".outerCont");
    const mainCont = document.querySelector(".cubeBg");
    const mainCont2 = document.querySelector(".cubeFg");
    let isMouseDown = false;
    let startX = 0;
    let rotationY = 0;
    let lastRotation = 0;
    let autoRotateInterval;



    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    function updateRotation() {
        mainCont.style.transition = "transform 0.6s ease-out";
        mainCont.style.transform = `rotateY(${rotationY}deg)`;
        mainCont2.style.transition = "transform 0.6s ease-out";
        mainCont2.style.transform = `rotateY(${rotationY}deg)`;
    }

    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            rotationY -= 120;
            updateRotation();
        }, 3000);
    }

    outerCont.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        startX = e.clientX;
        lastRotation = rotationY;
        stopAutoRotate();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isMouseDown) return;
        let deltaX = e.clientX - startX;
        let tempRotation = lastRotation + deltaX * 0.5;
        let angleDiff = Math.abs(tempRotation - lastRotation);

        if (angleDiff >= 70) {
            isMouseDown = false;
            rotationY = lastRotation + (tempRotation > lastRotation ? 120 : -120);
            updateRotation();
            startAutoRotate();
        } else {
            rotationY = tempRotation;
            mainCont.style.transition = "none";
            mainCont.style.transform = `rotateY(${rotationY}deg)`;
            mainCont2.style.transition = "none";
            mainCont2.style.transform = `rotateY(${rotationY}deg)`;
        }
    });

    document.addEventListener("mouseup", () => {
        if (!isMouseDown) return;
        isMouseDown = false;
        rotationY = Math.round(rotationY / 120) * 120;
        updateRotation();
        startAutoRotate();
    });

    startAutoRotate();
});