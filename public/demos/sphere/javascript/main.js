const ad = document.getElementById("ad");
const closeBtn = document.getElementById("closeBtn");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 300 / 250, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("globeCanvas"),
    alpha: true,
});
renderer.setSize(300, 250);

const geometry = new THREE.SphereGeometry(1.5, 32, 32);
const texture = new THREE.TextureLoader().load("./img/world.png"); //şəkil
const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 3;

let baseRotationSpeed = 0.005; //dönmə sürəti
let direction = 1;
let targetXRotation = 0;

ad.addEventListener("mousemove", (e) => {
    if (!ad.classList.contains("expanded")) return;

    const rect = ad.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;


    const maxTilt = 0.3;
    targetXRotation = (mouseY - 0.5) * maxTilt * 2;


    direction = mouseX < 0.5 ? -1 : 1;
});

function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.y += baseRotationSpeed * direction;
    sphere.rotation.x += (targetXRotation - sphere.rotation.x) * 0.05;

    renderer.render(scene, camera);
}

animate();

ad.addEventListener("mouseenter", () => {
    ad.classList.add("expanded");
    renderer.setSize(600, 600);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
});

closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    ad.classList.remove("expanded");
    renderer.setSize(300, 250);
    camera.aspect = 300 / 250;
    camera.updateProjectionMatrix();
});