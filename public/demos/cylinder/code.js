var def = {
    w: 300,
    h: 250,
    speed: 4,
    cube: {
        amm: 32,
        toDo: 33,
        r: 80,
        w: 0,
        h: 0,
        list: [],
        data: [],
        container: null,
        rotY: 0,
        rotYInc0: -0.15,
        rotYInc: -0.15,
        rotYSum: 0,
    },
    box: {
        texPos: {x: 415, y: 240},
    },
};

var o = {};

var oNames = {
    id: 'adArea mainCont dragEl grades',
};

function init() {
    prepareData();
    createCubes();
    adjustCube();

    initDrag();
    dragLoop();
    activateButtons();
}

function prepareData() {
    def.cube.w = 1.39 * def.cube.r / 2 * Math.tan(360 / (def.cube.amm / 2));
    def.cube.h = def.h;

    for (var i = 0; i < def.cube.amm; i++) {
        var angle = 360 * (i / def.cube.amm);
        var x = def.cube.r * Math.sin(Math.PI * 2 * angle / 360) * 2;
        var y = def.cube.r * Math.cos(Math.PI * 2 * angle / 360) * 2;

        def.cube.data.push({
            x: x,
            y: y,
            angle: angle,
        });
    }
}

function drawPoint(x, z) {
    var w = 10;
    var h = 10;

    var circle = document.createElement("div");
    circle.classList.add("circle");
    circle.style.width = w + "px";
    circle.style.height = h + "px";
    circle.style.borderRadius = Math.round(w / 2) + "px";
    circle.style.position = "absolute";
    circle.style.left = def.w / 2 - w / 2 + "px";
    circle.style.top = def.h / 2 - h / 2 + "px";
    circle.style.backgroundColor = "rgba(255, 255, 255, 0.8)";

    TweenMax.to(circle, 2, {y: def.h / 2, rotationX: 90, x: x + w / 2, z: z + h / 2});

    def.cube.container.appendChild(circle);
}

function createCubes() {
    createContainer();
    for (var i = 0; i < def.cube.amm; i++) {
        if (i < def.cube.toDo) {
            createSide(i);
        }
    }
}

function dragLoop() {
    requestAnimFrame(dragLoop);

    var dx = d.cur - d.del;

    d.del += dx / 8;
    def.cube.rotYSum += def.cube.rotYInc;
    def.cube.rotY = d.del + def.cube.rotYSum;
    TweenMax.set(def.cube.container, {rotationY: def.cube.rotY});
}

function createContainer() {

    def.cube.container = document.createElement("div");
    def.cube.container.classList.add("cube");
    def.cube.container.style.width = def.w + "px";
    def.cube.container.style.height = def.h + "px";
    def.cube.container.style.position = "absolute";
    def.cube.container.style.left = 0 + "px";
    def.cube.container.style.top = 0 + "px";
    TweenMax.set(def.cube.container, {z: 0,});
    o.mainCont.appendChild(def.cube.container);
}

function createSide(i) {
    var data = def.cube.data[i];

    var x = data.x;
    var y = data.y;
    var face = document.createElement("div");

    face.classList.add("face");
    face.classList.add("bg1");

    face.style.backgroundPosition = -i * def.cube.w + "px " + 0 + "px";
    face.style.backgroundRepeat = "no-repeat";

    face.style.left = def.w / 2 - def.cube.w / 2 + "px";

    var addX = (i != def.cube.amm - 1) ? 1.05 : 1;
    face.style.width = def.cube.w * addX + "px";
    face.style.height = def.cube.h + "px";

    TweenMax.set(face, {
        x: x,
        z: y,
    });

    TweenMax.set(face, {
        rotationY: data.angle,
    });

    def.cube.container.appendChild(face);
    def.cube.list.push(face)
}

function adjustCube() {
    var s = 0.92;
    var sx = 0.75;
    var sy = 0.7;
    var ssx = 0.92;
    TweenMax.set(def.cube.container, {scaleX: sx, scaleY: sy, scaleZ: sx})
}

function getTransforms(el) {
}

function rn() {
    return 20 + (0.5 - Math.random() * 40);
}

/////////////////// D R A G ////////////////////////

var startX, startY;
var dragFt = false;
var myDraggable = [];

d = {
    cur: 0,
    sum: 0,
    del: 0,
    last: 0,
};

function initDrag() {
    myDraggable.push(addDraggable(o.dragEl));
}

function addDraggable(dragObj) {
    return Draggable.create(dragObj, {
        onPress: function () {
            onPress(this);
        },
        onDrag: function (e) {
            onDrag(this);
        },
        onRelease: function (e) {
            onRelease(this);
        }
    })
}

function onPress(el) {
    if (!dragFt) {
        dragFt = true;
    }

    TweenMax.to(def.cube, 0.5, {rotYInc: 0, ease: Power1.easeInOut});
}

function onDrag(el, hit, endPos, midEndPos, z, rot, endScale) {
    var curX = el.x;
    var curY = el.y;

    d.cur = d.sum + curX;
}

function onRelease(el, endPos) {
    var curX = startX + el.x;
    var curY = startY + el.y;

    d.sum = d.cur;

    // if(d.cur == d.last){
    //   clickUrl();
    // }
    // d.last = d.cur;

    TweenMax.set(el.target, {x: 0, y: 0});
    TweenMax.to(def.cube, 0.5, {rotYInc: def.cube.rotYInc0, ease: Power1.easeInOut});
}

function activateButtons() {
    o.adArea.addEventListener("click", clickUrl);
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var assetsCur = 0;
var assetsTotal = 0;
var allLoaded = false;
var kaspinasImg;
var swipe_allowed = false;

function initLoad() {
    prepareElements();
    assetSetLoaded();
}

function prepareElements() {
  var names = oNames.id.split(' ');
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    o[name] = document.getElementById(name);
  }
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
            img.myCustomData = {total: names.length, a: a, name: names[i], numb: k};
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
                    }
                }

                countAsset(this.myCustomData.a, this.myCustomData.numb, this.myCustomData.total);
            };
            img.src = assets_url + names[i] + "." + a[k].format;
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
        init();
        TweenMax.to(adArea, 0.3, {delay: 0.05, opacity: 1});
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