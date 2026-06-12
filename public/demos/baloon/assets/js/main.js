
// vars
var w = 300;
var h = 250;

var ctx;
var d = new Date();
var fClick = false;

var o = {
    adArea: document.getElementById("adArea"),
    canvas: document.getElementById("canvas"),
};

var balloons = {
    amm: 25,
    startDelay: 0.3,
    w: '49px',
    h: '128px',
    bounds: [0, 0, w, h], // x1 y1 x2 y2
    boundsMargin: 35,
    imgID: "baloon",
    img: null,
    pos0: [],
    pos: [],
    introPos: [],
    explPower: [],
    fix: { x: -24, y: -40 },
    startD: {
        array: [],
        xAmm: 50,
        yAmm: 300,
        xRand: 0.5,
        yRand: 0.2,
    },
    wiggle: {
        array: [],
        dx: 40,
        dy: 16,
    },
    tapRadius: 40,
    active: [],
    tapFix: { x: -20, y: -20 },
    explFix: { x: 30, y: 18 }, // cia centravo mousa
    explodedAmm: 0,
    explAnim: [],
    expl: {
        power: 20,
        dur: 0.7,
        radius: 60,
        shardAmm: 4,
        shardSize: 14,
    }
}

function init() {
    // initAnim();
    cloudsAnimLoop();
    initCanvas();
}

function addEvents() {
    o.adArea.addEventListener("click", onTap);
    // o.adArea.addEventListener("mousemove", onTap);
    o.adArea.addEventListener("touchmove", onTap);
}

function endSlide() {
    _dsptr("finished");

    var to = "25% 50%"
    TweenMax.set(o.t21, { scale: 0, opacity: 1, transformOrigin: to })
    TweenMax.set(o.t22, { scale: 0, opacity: 1, transformOrigin: to })
    TweenMax.set(o.t23, { scale: 0, opacity: 1, transformOrigin: to })

    var dur = 0.85;
    TweenMax.to(o.t21, dur, { delay: 1.0, scale: 1, ease: Power2.easeOut })
    TweenMax.to(o.t22, dur, { delay: 1.2, scale: 1, ease: Power2.easeOut })
    TweenMax.to(o.t23, dur, { delay: 1.4, scale: 1, ease: Power2.easeOut })

    TweenMax.set(o.product, { y: 100, opacity: 0 })

    TweenMax.to(o.product, 1.3, { delay: 0.1, y: 0, opacity: 1, ease: Back.easeOut })

    setTimeout(activateButtons, 1000);
}

function onTap(event) {
    if (!fClick) {
        fClick = true;
        _dsptr("started");
        TweenMax.to(o.t11, 0.1, { opacity: 0 })
        TweenMax.to(o.t12, 0.1, { opacity: 0 })
    }

    var x = event.clientX + balloons.tapFix.x;
    var y = event.clientY + balloons.tapFix.y;
    var r = balloons.tapRadius;

    for (var i = 0; i < balloons.amm; i++) {
        if (balloons.active[i]) {
            var pos = balloons.pos[i];

            if (
                (pos.x - r < x) &&
                (pos.x + r > x) &&
                (pos.y - r < y) &&
                (pos.y + r > y)
            ) {
                console.log("hit")
                var cx = pos.x + balloons.explFix.x;
                var cy = pos.y + balloons.explFix.y;
                explodeBalloon(i, cx, cy);
            }
        }
    }
}

function explodeBalloon(i, cx, cy) {
    balloons.active[i] = false;
    balloons.explAnim[i].active = true;
    balloons.explAnim[i].initiated = true;
    // balloons.explAnim[i].data.x = x;
    // balloons.explAnim[i].data.y = y;

    balloons.explodedAmm++;

    animExplosion(i, cx, cy);

    if (balloons.explodedAmm >= balloons.amm) {
        endSlide();
    }
}

function initAnim() {
    // TweenMax.from(o.clouds, 4, {x: 100, ease:Power2.easeOut})
}

function cloudsAnimLoop() {
    TweenMax.to("#clouds", 8, { x: -w, ease: Linear.easeNone, repeat: -1 })
}

function initCanvas() {
    ctx = o.canvas.getContext('2d');
    balloons.img = o[balloons.imgID];

    var bM = balloons.boundsMargin;
    balloons.bounds[0] += bM;
    balloons.bounds[1] += bM;
    balloons.bounds[2] += -bM;
    balloons.bounds[3] += -bM;

    for (var i = 0; i < balloons.amm; i++) {
        var x = balloons.bounds[0] + Math.random() * (balloons.bounds[2] - balloons.bounds[0]);
        var y = balloons.bounds[1] + Math.random() * (balloons.bounds[3] - balloons.bounds[1]);
        balloons.pos0.push({ x: x, y: y });
        balloons.pos.push({ x: 0, y: 0 });
        balloons.wiggle.array.push({ x: 0, y: 0 });

        var dx = balloons.startD.xAmm + balloons.startD.xAmm * (0.5 - Math.random()) * balloons.startD.xRand;
        var dy = balloons.startD.yAmm + balloons.startD.yAmm * (0.5 - Math.random()) * balloons.startD.yRand;
        balloons.startD.array.push({ x: dx, y: dy });
        balloons.introPos.push({ x: dx, y: dy });
        balloons.active.push(true);
        balloons.explAnim.push({ active: false, initiated: false, data: {} });
    }

    setTimeout(function () {
        initBalloonsAnim();
        drawingLoop();
    }, balloons.startDelay * 1000);
}

function initBalloonsAnim() {
    var delAmm = 0.03;
    var dur = 2;
    for (var i = 0; i < balloons.amm; i++) {
        TweenMax.to(balloons.introPos[i], dur, { delay: i * delAmm, x: 0, y: 0, ease: Power2.easeOut })
    }

    setTimeout(showT1, (delAmm * balloons.amm + dur) * 1000 * 0.7);
}

function showT1() {
    var dur = 0.8;
    TweenMax.set(o.t11, { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" })
    TweenMax.set(o.t12, { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" })
    TweenMax.to(o.t11, dur, { delay: 0.00, scale: 1, opacity: 1, ease: Back.easeOut.config(3) })
    TweenMax.to(o.t12, dur, { delay: 0.15, scale: 1, opacity: 1, ease: Back.easeOut.config(3) })

    setTimeout(addEvents, 500);
}

function drawingLoop() {
    calcWiggle();
    calcPos();
    drawCanvas();
    drawExplosions();

    requestAnimFrame(drawingLoop);
}

function calcWiggle() {
    var d = new Date();
    var n = d.getTime();
    for (var i = 0; i < balloons.amm; i++) {
        if (balloons.active[i]) {
            var time = n + i * 120;
            var steps = 0.001;
            var x = balloons.wiggle.dx * Math.cos(time * steps)
            var y = balloons.wiggle.dy * Math.sin(time * steps)

            balloons.wiggle.array[i].x = x;
            balloons.wiggle.array[i].y = y;
        }
    }
}

function animExplosion(i, cx, cy) {
    // balloons.explAnim.push( {active: false, initiated: false, data: {}} );

    // for(var i=0; i<balloons.amm; i++){
    //   if( balloons.explAnim.active ){
    //     TweenMax.to()
    //   }
    // }

    balloons.explAnim[i].data.shards = [];

    for (var j = 0; j < balloons.expl.shardAmm; j++) {
        var ex = balloons.expl.radius * Math.cos(Math.random() * 360 * Math.PI / 180);
        var ey = balloons.expl.radius * Math.sin(Math.random() * 360 * Math.PI / 180);
        balloons.explAnim[i].data.shards.push({ x: 0, y: 0, x0: cx, y0: cy, size: balloons.expl.shardSize, endPos: { x: ex, y: ey } });
    }

    var counter = { val: 0 }
    TweenMax.to(counter, balloons.expl.dur, {
        val: 1, ease: Power2.easeOut, onUpdate: function () {
            // this.target.val;
            var val = this.target.val;

            for (var j = 0; j < balloons.expl.shardAmm; j++) {
                balloons.explAnim[i].data.shards[j].x = balloons.explAnim[i].data.shards[j].x0 + val * balloons.explAnim[i].data.shards[j].endPos.x;
                balloons.explAnim[i].data.shards[j].y = balloons.explAnim[i].data.shards[j].y0 + val * balloons.explAnim[i].data.shards[j].endPos.y;
                balloons.explAnim[i].data.shards[j].size = balloons.expl.shardSize * (1 - val);
            }
        }, onComplete: function () {
            // console.log("completed", i)
            balloons.explAnim[i].active = false;
        }
    });

    // expl: {
    //   dur: 0.7,
    //   radius: 60,
    //   shardAmm: 4,
    // }


}

function calcPos() {
    for (var i = 0; i < balloons.amm; i++) {
        if (balloons.active[i]) {
            var x = balloons.pos0[i].x + balloons.fix.x + balloons.introPos[i].x + balloons.wiggle.array[i].x;
            var y = balloons.pos0[i].y + balloons.fix.y + balloons.introPos[i].y + balloons.wiggle.array[i].y;

            balloons.pos[i].x = x;
            balloons.pos[i].y = y;
        }
    }
}

function drawCanvas() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < balloons.amm; i++) {
        if (balloons.active[i]) {
            ctx.drawImage(balloons.img, balloons.pos[i].x, balloons.pos[i].y);
        }
    }
}




function drawExplosions() {

    for (var i = 0; i < balloons.amm; i++) {
        if (balloons.explAnim[i].active) {


            if (balloons.explAnim[i].initiated) {
                balloons.explAnim[i].initiated = false;
            } else {
                for (var j = 0; j < balloons.expl.shardAmm; j++) {
                    var x = balloons.explAnim[i].data.shards[j].x;
                    var y = balloons.explAnim[i].data.shards[j].y;
                    var size = balloons.explAnim[i].data.shards[j].size;

                    var grd = ctx.createRadialGradient(x, y, 0, x, y, size);
                    grd.addColorStop(0, "#9f5d4f");
                    grd.addColorStop(1, "#5b251b");

                    // ctx.fillStyle = "#612a1e";
                    ctx.fillStyle = grd;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }

        }
    }

}

//   for( var j=0; j<balloons.expl.shardAmm; j++ ){
//     balloons.explAnim[i].data.shards[j].x = balloons.explAnim[i].data.shards[j].x0 + val * balloons.explAnim[i].data.shards[j].endPos.x;
//     balloons.explAnim[i].data.shards[j].y = balloons.explAnim[i].data.shards[j].y0 + val * balloons.explAnim[i].data.shards[j].endPos.y;
//   }
// }});



////////////////// F U N C T I O N S //////////////////////

function activateButtons() {
    o.adArea.addEventListener("click", ctaFunction);
}

function getCssProperty(elmId, property) {
    var elem = document.getElementById(elmId);
    return parseInt(window.getComputedStyle(elem, null).getPropertyValue(property));
}


window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


//////////////////////// IMAGE LOAD FUNCTIONS ///////////////////////////

var assetsCur = 0;
var assetsTotal = 0;
var allLoaded = false;
var swipe_allowed = false;

//

function initLoad() {
    loadAsset(assets.init);
}

function loadOther() {
    assetsTotal = Object.size(assets);
    for (var prop in assets) {
        if (prop != "init") {
            loadAsset(assets[prop]);
        }
    }
}

function loadMid() {
    loadAsset(assets.mid);
}

function loadEnd() {
    loadAsset(assets.end);
}

function loadAsset(a) {
    a.cur_asset_pack = 0;
    a.asset_packs = a.length;

    for (var k = 0; k < a.asset_packs; k++) {
        var names = a[k].names.split(" ");
        a[k].curLoad = 0;

        for (var i = 0; i < names.length; i++) {
            var img = new Image();
            img.myCustomData = { total: names.length, a: a, name: names[i], numb: k };
            img.onload = function () {
                o[this.myCustomData.name] = document.getElementById(this.myCustomData.name);

                var type = this.myCustomData.a[this.myCustomData.numb].type;
                var elAmm = 1;
                if (type == "class") {
                    o[this.myCustomData.name] = document.getElementsByClassName(this.myCustomData.name);
                    elAmm = o[this.myCustomData.name].length;
                }

                for (var j = 0; j < elAmm; j++) {
                    var el;
                    if (type == "class") {
                        el = o[this.myCustomData.name][j];
                        el.style.backgroundImage = "url(" + this.src + ")";
                    } else if (type == "id") {
                        el = o[this.myCustomData.name];
                        el.style.backgroundImage = "url(" + this.src + ")";
                    } else if (type == "src") {
                        el = o[this.myCustomData.name];
                        o[this.myCustomData.name].src = this.src;
                    }

                    el.style.position = "absolute";
                    el.style.width = this.width + "px";
                    el.style.height = this.height + "px";

                    if (this.myCustomData.a[this.myCustomData.numb].scale != 1) {
                        var scale = 1 / this.myCustomData.a[this.myCustomData.numb].scale;
                        TweenMax.set(el, { scale: scale, transformOrigin: '0% 0%' });
                    }
                }

                countAsset(this.myCustomData.a, this.myCustomData.numb, this.myCustomData.total);
            };
            img.src = assets_url + names[i] + "." + a[k].format;
        }
    }
}

function countAsset(asset, k, total) {
    asset[k].curLoad++;
    if (asset[k].curLoad == total) {
        asset.cur_asset_pack++;
        if (asset.cur_asset_pack == asset.asset_packs) {
            assetSetLoaded();
        }
    }
}

function assetSetLoaded() {
    // console.log("assetSetLoaded");
    assetsCur++;
    if (assetsCur == 1) {
        // adArea.style.opacity = 1;
        TweenMax.to(o.adArea, 0.3, { delay: 0.05, opacity: 1 });
        init();
        // loadMid();
        loadOther();
        // } else if(assetsCur == 2) {
        // loadEnd();

        // initDrag();
        // swipe_allowed = true;
    } else if (assetsCur == assetsTotal) {
        allLoaded = true;
    }
}

//

Object.size = function (obj) { // get o ammount in var
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


if (window.addEventListener) {
    window.addEventListener('load', initLoad(), false);
} else if (window.attachEvent) {
    window.attachEvent('onload', initLoad());
}