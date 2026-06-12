;
window.addEventListener('load', () => {

	document.getElementById('preloader').style.display = 'none';

	document.getElementById('adsArea').addEventListener('click', ctaFunction);
	  
	gsap.set(".adviad-flip-holder", {perspective:600});
	gsap.set(".adviad-flip-back", {rotationX:180});
	gsap.set([".adviad-flip-back", ".adviad-flip-front"], {backfaceVisibility:"hidden"});
	
	let pauseTime = 2.5;
	let currentCard = -1;
	gsap.delayedCall(pauseTime, workCardsRotation);

	function workCardsRotation() {
		gsap.to('.adviad-flip', 2, {rotationX:-180, transformOrigin:"center center", transformStyle:"preserve-3d", ease:Back.easeInOut, })
		gsap.to('.adviad-flip', 2, {rotationX:-360, transformOrigin:"center center", transformStyle:"preserve-3d", ease:Back.easeInOut, delay:pauseTime, onComplete:resetCard });
	}
	
	function resetCard() {
		gsap.set('.adviad-flip', {rotationX:0});
		gsap.delayedCall(pauseTime, workCardsRotation);
	}

});

