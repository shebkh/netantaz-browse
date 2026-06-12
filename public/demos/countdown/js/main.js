function ctaFunction() {
    var ctaUrl = clickTag;
    window.open(ctaUrl);
}

// I N I T
function init() {
    enableClock();
    showClock();

}

function showClock() {
    var cdDay = document.getElementById('cdDay');
    var cdHour = document.getElementById('cdHour');
    var cdMin = document.getElementById('cdMin');
    var cdSec = document.getElementById('cdSec');

    var timeExt = document.getElementById('timeExt');

    setScale(cdDay, 0);
    setScale(cdHour, 0);
    setScale(cdMin, 0);
    setScale(cdSec, 0);

    timeExt.style.opacity = 0;

    TweenMax.to(cdDay, .35, {scaleX: 1, scaleY: 1, ease: Back.easeOut.config(1)});
    TweenMax.to(cdHour, .35, {delay: 0.1, scaleX: 1, scaleY: 1, ease: Back.easeOut.config(1)});
    TweenMax.to(cdMin, .35, {delay: 0.2, scaleX: 1, scaleY: 1, ease: Back.easeOut.config(1)});
    TweenMax.to(cdSec, .35, {delay: 0.3, scaleX: 1, scaleY: 1, ease: Back.easeOut.config(1)});

    TweenMax.to(timeExt, .35, {delay: 0.25, opacity: 1});
}

// SLAIDAI PRASIDEDA CIA

function toggleSlides() {
    var curSlide = -1;
    var slides = ['first', 'second'];
    curSlide++;
    if (curSlide >= 2) {
        curSlide = 0
    }

    var cur = slides[curSlide];
    switch (cur) {
        case 'first':
            TweenMax.to("#secondSlide", 0.8, {x: 0, ease: Power3.easeInOut});
            console.log("21231");
            

            setTimeout(toggleSlides, 300);
            break;
        case 'second':
            TweenMax.to("#secondSlide", 0.8, {x: -300, ease: Power3.easeInOut});
            TweenMax.to("#firstSlide", 0.8, {x: -300, ease: Power3.easeInOut});
            break;
    }
}

var killToggle = true;
function enableClock() {
    var cdDay = document.getElementById("cdDay");
    var cdHour = document.getElementById("cdHour");
    var cdMin = document.getElementById("cdMin");
    var cdSec = document.getElementById("cdSec");

    // IKI KADA
    var now = new Date().getTime();
    var distance1 = countDownDate1 - now;
    var timeLeft = getTimeLeft(distance1);
    animateTime(timeLeft);

    var x = setInterval(function () {
        displayTime(countDownDate1, cdDay, cdHour, cdMin, cdSec);
    }, 1000);

}

function clockLoop(dur) {
    var time = getTimeLeft(dur);
    setClock(time);

    dur -= 1000;
    if (dur > 0) {
        setTimeout(function () {
            clockLoop(dur)
        }, 1000);
    } else {
        toggleSlides();
    }
}

function showSecondImage() {

    TweenMax.to("#secondSlide", 0.8, {x: -300, ease: Power3.easeInOut});
    TweenMax.to("#firstSlide", 0.8, {x: -300, ease: Power3.easeInOut});
}

function animateTime(timeLeft) {
    var cdDay = document.getElementById("cdDay");
    var cdHour = document.getElementById("cdHour");
    var cdMin = document.getElementById("cdMin");
    var cdSec = document.getElementById("cdSec");

    var animDur = 0.1;

    var foo = {bar: 31}
    TweenLite.to(foo, animDur, {
        bar: timeLeft[0], roundProps: "bar", onUpdate: function () {
            var cdDay = document.getElementById('cdDay');
            cdDay.innerHTML = this.target.bar;
        }
    });

    var foo = {bar: 24}
    TweenLite.to(foo, animDur, {
        bar: timeLeft[1], roundProps: "bar", onUpdate: function () {
            var cdDay = document.getElementById('cdHour');
            cdDay.innerHTML = this.target.bar;
        }
    });

    var foo = {bar: 60}
    TweenLite.to(foo, animDur, {
        bar: timeLeft[2], roundProps: "bar", onUpdate: function () {
            var cdDay = document.getElementById('cdMin');
            cdDay.innerHTML = this.target.bar;
        }
    });

    var foo = {bar: 60}
    timeLeft[3] = timeLeft[3] - animDur;
    TweenLite.to(foo, animDur, {
        bar: timeLeft[3], roundProps: "bar", onUpdate: function () {
            var cdDay = document.getElementById('cdSec');
            cdDay.innerHTML = this.target.bar;
        }
    });

}

function displayTime(countDownDate1, cdDay, cdHour, cdMin, cdSec) {
    var now = new Date().getTime();

    var distance1 = countDownDate1 - now;

    var timeLeft = getTimeLeft(distance1);

    if (distance1 < 0) {
        changeVal(cdDay, 0);
        changeVal(cdHour, 0);
        changeVal(cdMin, 0);
        changeVal(cdSec, 0);
        showSecondImage();
    } else {
        changeVal(cdDay, timeLeft[0]);
        changeVal(cdHour, timeLeft[1]);
        changeVal(cdMin, timeLeft[2]);
        changeVal(cdSec, timeLeft[3]);
    }
}

function changeVal(el, val) {
    if (el.innerHTML != val) {
        el.innerHTML = val;
    }
}

function getTimeLeft(distance1) {
    var days1 = Math.floor(distance1 / (1000 * 60 * 60 * 24));
    var hours1 = Math.floor((distance1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes1 = Math.floor((distance1 % (1000 * 60 * 60)) / (1000 * 60));
    var seconds1 = Math.floor((distance1 % (1000 * 60)) / 1000);
    return [days1, hours1, minutes1, seconds1];
}

// Functions

function setScale(obj, scale) {
    obj.style.transform = 'scale(' + scale + ',' + scale + ')';
    obj.style.webkitTransform = 'scale(' + scale + ',' + scale + ')';
    obj.style.msTransform = 'scale(' + scale + ',' + scale + ')';
}

//////////////////////////////////////////////////////
init();
//////////////////////////////////////////////////////