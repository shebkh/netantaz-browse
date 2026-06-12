var curX, curY;
var startX, startY;
var dragedX = 0, dragedY;
var dragX = 0, dragY;
var lDragX, lDragY;
var delX = 0, delY;
var ftDrag = false;
var ctx1, ctx2, ctx3, ctx4, canvas;

var def = {
    drag: {
        x: 0,
    },
    rot: {
        cur: { x: 0, y: 0, z: 0 },
        start: {
            active: true,
            x: 0,
            y: 0,
            z: 0,
            inc: { x: 0.1, y: 1, z: -0.1 },
        },
        main: { x: 0, y: 0.0, z: 0 },
        sum: { x: 0, y: 0, z: 0 },
        add: { x: 0, y: 0, z: 0 },
    },
    scale: {
        start: 0.37,
        x: 0.8,
        y: 0.37,
        z: 0.37,
    },
    pos: {
        y: 0,
        levYamm: 20,
    },
    imag: [
        'pic1',
        'pic2',
        'pic3',
    ],
    phase: {
        cur: 0,
    },
    curPic: 0,
    totPic: 3,
};

function init() {
    initDrag();
    myDrags[0][0].disable();
    initAnim();

    rotLoop();
}

function initCanvas() {
    ctx1 = can1.getContext('2d');
    ctx2 = can2.getContext('2d');
    ctx3 = can3.getContext('2d');
    ctx4 = can4.getContext('2d');

    drawCan(ctx1, def.curPic, 0);
    drawCan(ctx2, def.curPic, 0);
    drawCan(ctx3, def.curPic, 0);
    drawCan(ctx4, def.curPic, 0);
}

function drawCan(ctx, id, delay) {
    setTimeout(function () {
        var img = objects[def.imag[id]];
        ctx.drawImage(img, 0, 0);
    }, delay)
}

function changePic() {
    var id = '.pic' + (def.curPic + 1);
    console.log(id);
    TweenMax.set(id, { opacity: 0, visibility: 'hidden' });

    def.curPic++;
    console.log(def.curPic);

    var id = '.pic' + (def.curPic + 1);
    TweenMax.set(id, { opacity: 1, visibility: 'visible' });
}

var objects = {
    adArea: document.getElementById("adArea"),
    c1: document.getElementById("c1"),
    c2: document.getElementById("c2"),
    swipe_icon: document.getElementById("swipe_icon"),
    can1: document.getElementById("can1"),
    can2: document.getElementById("can2"),
    can3: document.getElementById("can3"),
    can4: document.getElementById("can4"),
    cta_arrow: document.getElementById("cta_arrow")
};

var ss = 0.8;
var s1 = 0.37;
var s0 = 0.2;
var addY = -20;

function initAnim() {

    var tl1 = new TimelineMax({ repeat: -1 });
    tl1.set(objects.arrow_l, { x: 20, opacity: 0 })
        .to(objects.arrow_l, 0.5, { x: 0, opacity: 0, ease: Power2.easeOut })
        .to(objects.arrow_l, 0.5, { x: -20, opacity: 0, ease: Power2.easeIn });
    var tl2 = new TimelineMax({ repeat: -1 });
    tl2.set(objects.arrow_r, { x: -20, opacity: 0 })
        .to(objects.arrow_r, 0.5, { x: 0, opacity: 1, ease: Power2.easeOut })
        .to(objects.arrow_r, 0.5, { x: 20, opacity: 0, ease: Power2.easeIn });

    TweenMax.set('.csf', { scale: 0.995 });

    TweenMax.set(objects.c1, { scaleX: s0, scaleZ: s0, scaleY: s0, y: 0 });

    TweenMax.from(objects.c1, 1.5, {
        y: -300, ease: Back.easeOut.config(2), onComplete: function () {

        }
    });

    TweenMax.to(objects.c1, 2, {
        delay: 0.0, scaleX: ss, scaleZ: ss, scaleY: ss, ease: Power2.easeInOut, onComplete: function () {
            setTimeout(function () {
                zoomOut();
            }, 100)

        }
    });

    TweenMax.from(def.rot.start, 2, { x: 55, y: 88, z: 111, ease: Power2.easeOut });
}

var yTween;
var sTween;

function zoomOut() {

    TweenMax.to(nAdd, 1, { delay: 0.5, y: -15, ease: Power1.easeInOut });

    TweenMax.set(objects.swipe_icon, { y: 50 });
    TweenMax.to(objects.swipe_icon, 0.5, { delay: 0.85, y: 0, opacity: 1, ease: Power2.easeOut });

    objects.shadow.style.visibility = "visible";

    def.phase.cur = 1;
    var s2 = 0.55;
    sTween = TweenMax.to(def.scale, 2.3, { x: s2, y: s2, z: s2, ease: Power2.easeInOut });
    yTween = TweenMax.to(def.pos, 1.3, { y: def.pos.levYamm / 2, ease: Power1.easeInOut, repeat: -1, yoyo: true });
    TweenMax.to(def.rot.main, 1, { y: 0.5, ease: Power1.easeInOut });

    cur = 0;

    myDrags[0][0].enable();
}

var rWiggle = 0;
var cur = 0;
var dragAmm = 0;
var newDel = 0;
var nAdd = { y: -0 };

function rotLoop() {
    dragX = dragX * 0.8;
    var dx = dragX - delX;
    delX += dx / 10;

    var newDrag = dragAmm + curDragX;

    var dx = newDrag - newDel;
    newDel += dx / 10;


    if (def.phase.cur == 0) {
        TweenMax.set(objects.c1, { rotationX: def.rot.start.x, rotationY: def.rot.start.y, rotationZ: def.rot.start.z });
    } else if (def.phase.cur == 1) {
        cur += 0.1;

        rWiggle = 0.2 * Math.cos(cur * 0.1);

        var speedX = def.rot.start.y + rWiggle + delX * 0.1;

        def.rot.cur.x = def.rot.add.x;
        def.rot.cur.y += speedX;
        def.rot.cur.z = def.rot.add.z;

        var ds = Math.abs(delX * 0.01);
        if (ds > 40) {
            ds = 40
        }
        var s = def.scale.x - ds;

        var fs = s * 2.5;
        if (fs < 0) {
            fs = 0
        }
        var so = fs * 0.4;
        TweenMax.set(objects.shadow, { opacity: so, scaleX: fs, scaleZ: fs, scaleY: fs });

        TweenMax.set(objects.c1, {
            scaleX: s,
            scaleY: s,
            scaleZ: s,
            rotationX: def.rot.cur.x,
            rotationY: def.rot.cur.y,
            rotationZ: def.rot.cur.z,
            y: def.pos.y + nAdd.y
        });

        if (Math.abs(newDel) > 80) {
            TweenMax.to(objects.swipe_icon, 0.3, { delay: 0.0, opacity: 0, y: 50, ease: Power1.easeIn });

            myDrags[0][0].disable();
            newDrag = 0;
            dragAmm = 0;
            curDragX = 0;
            lastDx = 0;
            nAdd.y = 0;

            TweenMax.set(myDrags[0][0].target, { x: 0, y: 0, left: 0, top: 0 });

            def.phase.cur = 2;
            var side = speedX / Math.abs(speedX);

            var dy = def.rot.cur.y % 360;
            var y = def.rot.cur.y + side * (720 + dy * (-side));

            TweenMax.to(objects.shadow, 1, { opacity: 0.6, scaleX: 1, scaleZ: 1, scaleY: 1, ease: Power2.easeInOut });

            TweenMax.to(objects.c1, 1, { delay: 0.0, y: 0, scaleX: ss, scaleY: ss, scaleZ: ss, ease: Back.easeInOut });

            TweenMax.to(objects.c1, 1 / 2, {
                rotationY: y / 2, y: 0, ease: Power1.easeIn, onComplete: function () {

                    TweenMax.to(objects.c1, 1 / 2, {
                        rotationY: y, y: 0, ease: Power3.easeOut, onComplete: function () {

                            if (def.curPic + 1 < def.totPic) {
                                def.rot.main.y = 0;
                                delX = 0;
                                def.rot.start.y = 0;
                                def.rot.cur.y = 0;
                                def.pos.y = 0;
                                dragX = 0;
                                def.scale.x = ss;
                                myDrags[0][0].disable();
                                yTween.kill();
                                sTween.kill();
                                nAdd.y = 0;

                                setTimeout(zoomOut, 400);
                            } else {
                                myDrags[0][0].disable();
                                startEvent("finished");
                                TweenMax.set(objects.cta, { scale: 0, opacity: 0, transformOrigin: "83% 93%" });
                                TweenMax.to(objects.cta, 0.65, { scale: 1, ease: Back.easeOut });
                                TweenMax.set(objects.cta_arrow, { y: 100 });
                                TweenMax.to(objects.cta_arrow, 0.6, {
                                    delay: 0.55, opacity: 0, y: 0, ease: Back.easeOut.config(1.7),
                                    onComplete: function () {
                                        TweenMax.to(objects.cta_arrow, 0.4, { delay: 0.0, x: 8, ease: Power2.easeInOut });
                                        TweenMax.to(objects.cta_arrow, 0.4, { delay: 0.4, x: 0, ease: Power2.easeInOut });
                                        TweenMax.to(objects.cta_arrow, 0.4, { delay: 0.8, x: 8, ease: Power2.easeInOut });
                                        TweenMax.to(objects.cta_arrow, 0.4, { delay: 1.2, x: 0, ease: Power2.easeInOut });
                                    }
                                });

                                setTimeout(function () {
                                    adArea.addEventListener("click", ctaFunction);
                                }, 500);
                            }

                        }
                    })

                }
            });

            setTimeout(function () {
                changePic();
            }, 500);
        }

    }

    if (def.rot.start.active) {
    }

    lDragX = dragX;
    requestAnimFrame(rotLoop);
}

function checkIfHideEl(rot, el1, el2, el3, el4) {
    arot = Math.abs(rot);
    if ((arot < 90) || (arot > 270)) {
        hideEl(el4, 0);
    } else {
        hideEl(el4, 1);
    }

    if ((rot > 180) || ((rot > -180) && (rot < 0))) {
        hideEl(el3, 0);
    } else {
        hideEl(el3, 1);
    }

    if ((arot < 90) || (arot > 270)) {
        hideEl(el2, 1);
    } else {
        hideEl(el2, 0);
    }

    if ((rot <= 0) && (rot > -180) || (rot > 180)) {
        hideEl(el1, 1);
    } else {
        hideEl(el1, 0);
    }
}

function hideEl(el, opac) {
    if (el.style.opacity != opac) {
        TweenMax.set(el, { opacity: opac });
    }
}

var myDrags = [];

function initDrag() {
    myDrags.push(addDraggable("#dragArea"));
}

function addDraggable(dragObj) {
    return Draggable.create(dragObj, {
        onPress: function () {
            onPress(this);
        },
        onDrag: function (e) {
            onDrag(this);
        },
        onDragEnd: function (e) {
            onDragEnd(this)
        }, onRelease: function (e) {
            onRelease(this);
        }
    })
}

function onPress(el) {

    startX = 0;
    startY = 0;

    if (!ftDrag) {
        ftDrag = true;
        startEvent("started");
    }
}

var lastDx = 0;
var curDragX = 0;

function onDrag(el, hit, endPos, midEndPos, z, rot, endScale) {
    curX = startX + el.x;
    curY = startY + el.y;

    dragX += curX - lastDx;

    curDragX = curX;

    lastDx = curX;
}

function onDragEnd(el, hit, endPos, z) {
}

function onRelease(el, endPos) {
    dragAmm += curDragX;
    curDragX = 0;

    lastDx = 0;
    dragedX += curX;
    TweenMax.set(el.target, { x: 0, y: 0, left: 0, top: 0 })
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

var assetsCur = 0;
var assetsTotal = 0;
var allLoaded = false;
var swipe_allowed = false;

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

    for (var o = 0; o < a.asset_packs; o++) {
        var names = a[o].names.split(" ");
        a[o].curLoad = 0;

        for (var i = 0; i < names.length; i++) {
            var img = new Image();
            img.myCustomData = { total: names.length, a: a, name: names[i], numb: o };
            img.onload = function () {
                objects[this.myCustomData.name] = document.getElementById(this.myCustomData.name);

                var type = this.myCustomData.a[this.myCustomData.numb].type;
                var elAmm = 1;
                if (type == "class") {
                    objects[this.myCustomData.name] = document.getElementsByClassName(this.myCustomData.name);
                    elAmm = objects[this.myCustomData.name].length;
                }

                for (var j = 0; j < elAmm; j++) {
                    var el;
                    if (type == "class") {
                        el = objects[this.myCustomData.name][j];
                        el.style.backgroundImage = "url(" + this.src + ")";
                    } else if (type == "id") {
                        el = objects[this.myCustomData.name];
                        el.style.backgroundImage = "url(" + this.src + ")";
                    } else if (type == "src") {
                        el = objects[this.myCustomData.name];
                        objects[this.myCustomData.name].src = this.src;
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
            img.src = assets_url + names[i] + "." + a[o].format;
        }
    }
}

function countAsset(asset, o, total) {
    asset[o].curLoad++;
    if (asset[o].curLoad == total) {
        asset.cur_asset_pack++;
        if (asset.cur_asset_pack == asset.asset_packs) {
            assetSetLoaded();
        }
    }
}

function assetSetLoaded() {
    assetsCur++;
    if (assetsCur == 1) {
        TweenMax.to(objects.adArea, 0.3, { delay: 0.05, opacity: 1 });
        init();
        loadOther();
    } else if (assetsCur == assetsTotal) {
        allLoaded = true;
    }
}


Object.size = function (obj) {
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