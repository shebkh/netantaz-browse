;

function createBlocks() {
  workCardsRotation();
  document.getElementById('preloader').style.display = 'none';
};

gsap.set(".eskimi-flip-holder", {
  perspective: 600
});
gsap.set(".eskimi-flip-back", {
  rotationX: 180
});
gsap.set([".eskimi-flip-back", ".eskimi-flip-front"], {
  backfaceVisibility: "hidden"
});

//logo and cta

if (logoFile !== "") {
  let logoImg = document.createElement('img');
  logoImg.src = logoFile;
  logoImg.classList.add('abs');
  logoImg.classList.add('logo');
  adsArea.appendChild(logoImg);
}

if (ctaFile !== "") {
  let ctaImg = document.createElement('img');
  ctaImg.src = ctaFile;
  ctaImg.classList.add('abs');
  ctaImg.classList.add('cta');
  adsArea.appendChild(ctaImg);
}



function workCardsRotation() {
  let rotX = 0;
  setInterval(() => {
    rotX += 180;
    gsap.to('.eskimi-flip', 2, {
      rotationX: -(rotX),
      transformOrigin: "center center",
      transformStyle: "preserve-3d",
      ease: Back.easeInOut,
    })
  }, 2500);
}

function setBg(el, url) {
  el.style.backgroundImage = "url('" + url + "')";
};

window.addEventListener('load', () => {

  adsArea.addEventListener('click', ctaFunction);

  createBlocks();

});
// window load end