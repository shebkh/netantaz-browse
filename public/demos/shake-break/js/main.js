

var liteShake = function () {
    var container = document.getElementById('adRect');
    var canvas, ctx;
    var cWidth = 300;
    var cHeight = 250;
    var polyAmm;
    var polygonGroup = [];
    var img = new Image();
    //var state = "waiting";
    var anim = {
        cur: 0,
        ft: true,
        shirinkComplete: false,
        staticCanvas: true
    }

    var ctaDelay = 400;
    var par = {
        dur: {
            x: 1900,
            y: 1900,
            r: 1000,
            behind: 1500,
            smoke: 1800,
            gap: 400,
            shrink: 500
        },
        ease: {
            x: TWEEN.Easing.Quartic.Out,
            y: TWEEN.Easing.Quartic.Out,
            r: TWEEN.Easing.Sinusoidal.Out,
            behind: TWEEN.Easing.Quartic.InOut,
            smoke: TWEEN.Easing.Sinusoidal.Out,
            gap: TWEEN.Easing.Quartic.InOut,
            shrink: TWEEN.Easing.Exponential.Out
        },
        behindScale: 1.6,
        shrinkScale: 0.83,
        shrinkScaleRand: 0.7,
        gap: {
            opacity: 1
        }
    }


    function clicked() {
        triggerExplode();
    }

    function shakeEvent() {
        triggerExplode();
    }

    function triggerExplode() {
        requestAnimFrame(animate);
        removeEvents();
        setTimeout(activateClickTag, ctaDelay);
        zoomBehind();
        smokeAnim();
    }

    function init() {
        polyAmm = explCoords.length;

        createCanvas();
        createPolygons();

        cleanCanvas();
        drawPolygons();

        document.getElementById("gap").style.opacity = 1;
        document.getElementById("bgBehind").style.opacity = 1;
        document.getElementById("smoke").style.opacity = 1;
        document.getElementById("smoke2").style.opacity = 1;
        window.addEventListener('devicemotion', motion, false);
        _dsptr("started");
    }

    var stopAnimate = false;

    function animate(time) {
        switch (anim.cur) {
            case 0: // intro
                if (anim.ft == true) {
                    anim.ft = false;
                    anim.staticCanvas = false;
                    shrink();
                }
                cleanCanvas();
                drawPolygons();
                break;
            case 1:
                if (anim.ft == true) {
                    anim.ft = false;
                    explode2();
                }
                cleanCanvas();
                drawPolygons();
                break;
        }

        if (!stopAnimate) {
            requestAnimFrame(animate);
            TWEEN.update(time);
        } else {
            cleanCanvas();
        }
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

    function nextAnim() {
        anim.cur++;
        anim.ft = true;
    }

    function createCanvas() {
        canvas = document.getElementById('ctx0');
        ctx = canvas.getContext('2d');
        var pattern = ctx.createPattern(img, "repeat");
        ctx.fillStyle = pattern;

    }

    function createPolygons() {
        for (var i = 0; i < polyAmm; i++) {
            polygonGroup.push(polygon(i));
            polygonGroup[i].setCoords();
            polygonGroup[i].setCenter();
        }
    }

    var polygon = makeClass();
    polygon.prototype.init = function (id) {
        this.id = id,
            this.coords = [],
            this.center = { x: 0, y: 0 },
            this.pos = { x: 0, y: 0 },
            this.rot = 0,
            this.scale = 1,
            this.setCoords = function () {
                this.coords = explCoords[this.id];
            }
        this.setCenter = function () {
            this.center = calPolygonCenter(this.id);
        }
    }

    function drawPolygons() {
        if (anim.staticCanvas) {
            ctx.drawImage(img, 0, 0, cWidth, cHeight);
        }

        for (var i = 0; i < polyAmm; i++) {
            var x = polygonGroup[i].center.x;
            var y = polygonGroup[i].center.y;


            ctx.save();

            ctx.translate(x + polygonGroup[i].pos.x, y + polygonGroup[i].pos.y);

            ctx.scale(polygonGroup[i].scale, polygonGroup[i].scale);

            ctx.rotate(degrees2rad(polygonGroup[i].rot));

            ctx.beginPath();
            ctx.moveTo(polygonGroup[i].coords[0] - x, polygonGroup[i].coords[1] - y);
            for (var j = 1; j < polygonGroup[i].coords.length; j++) {
                ctx.lineTo(polygonGroup[i].coords[j * 2] - x, polygonGroup[i].coords[j * 2 + 1] - y);
            }
            ctx.closePath();

            ctx.clip();
            ctx.drawImage(img, -x, -y, cWidth, cHeight);

            ctx.restore();
        }
    }

    function cleanCanvas() {
        ctx.clearRect(0, 0, cWidth, cHeight);
    }

    function zoomBehind() {
        var coordS = { s: par.behindScale };
        var coordO = { o: par.gap.opacity };
        var sCoords = 1;
        var oCoords = 0;

        var tween = new TWEEN.Tween(coordS)
            .to({ s: sCoords }, par.dur.behind)
            .easing(par.ease.behind)
            .onUpdate(function () {
                document.getElementById("bgBehind").style.transform = "scale(" + this.s + ")";
            })
            .start();

    }

    function smokeAnim() {

        var coordS = { s: 0 };
        var sCoords = 1;

        var tween = new TWEEN.Tween(coordS)
            .to({ s: sCoords }, par.dur.smoke)
            .easing(par.ease.smoke)
            .onUpdate(function () {
                var leftVal = this.s * 100;
                var opacVal = Math.pow(1 - this.s, 0.5);
                document.getElementById("smoke").style.left = leftVal + "px";
                document.getElementById("smoke").style.opacity = opacVal;
            })
            .start();


        var tween = new TWEEN.Tween(coordS)
            .to({ s: sCoords }, par.dur.smoke)
            .easing(par.ease.smoke)
            .onUpdate(function () {
                var leftVal = - 50 - this.s * 100;
                var opacVal = Math.pow(1 - this.s, 0.5);
                document.getElementById("smoke2").style.left = leftVal + "px";
                document.getElementById("smoke2").style.opacity = opacVal;
            })
            .start();

    }


    function shrink() {
        for (var i = 0; i < polyAmm; i++) {

            var wCoords = { s: (1 - (1 - par.shrinkScale) + (1 - par.shrinkScale) * Math.random() * par.shrinkScaleRand) };

            var coordS = { s: 1, id: i };

            var tweenX = new TWEEN.Tween(coordS)
                .to({ s: wCoords.s }, par.dur.shrink)
                .easing(par.ease.shrink)
                .onUpdate(function () {
                    polygonGroup[this.id].scale = this.s;
                })
                .onComplete(function () {
                    if (!anim.shirinkComplete) {
                        nextAnim();
                        anim.shirinkComplete = true;
                    }
                })
                .start();
        }
    }

    function explode() {
        for (var i = 0; i < polyAmm; i++) {

            var wCoords = { x: getXCoord(i), y: getYCoord(i), r: (0.5 - Math.random()) * 360 };

            var coordY = { y: 0, id: i };
            var coordX = { x: 0, id: i };
            var coordR = { r: 0, id: i };

            var tweenX = new TWEEN.Tween(coordX)
                .to({ x: wCoords.x }, par.dur.x * (0.6 + 0.4 * Math.random()))
                .easing(par.ease.x)
                .onUpdate(function () {
                    polygonGroup[this.id].pos.x = this.x;
                })
                .start();

            var tweenY = new TWEEN.Tween(coordY)
                .to({ y: wCoords.y }, par.dur.y * (0.8 + 0.2 * Math.random()))
                .easing(par.ease.y)
                .onUpdate(function () {
                    polygonGroup[this.id].pos.y = this.y;
                })
                .start();

            var tweenR = new TWEEN.Tween(coordR)
                .to({ r: wCoords.r }, par.dur.r * (0.6 + 0.4 * Math.random()))
                .easing(par.ease.r)
                .onUpdate(function () {
                    polygonGroup[this.id].rot = this.r;
                })
                .start();
        }

        var coordO = { o: par.gap.opacity };
        var oCoords = 0;

        var tween = new TWEEN.Tween(coordO)
            .to({ o: oCoords }, par.dur.gap)
            .easing(par.ease.gap)
            .onUpdate(function () {
                document.getElementById("gap").style.opacity = this.o;
            })
            .start();
    }

    function explode2() {
        var xCoords = getXCoord2();
        var yCoords = getYCoord2();
        var rCoords = getRCoord();
        var wCoords = { x: 1, y: 1, r: 1 };

        var coordY = { y: 0 };
        var coordX = { x: 0 };
        var coordR = { r: 0 };

        var tweenX = new TWEEN.Tween(coordX)
            .to({ x: wCoords.x }, par.dur.x)
            .easing(par.ease.x)
            .onUpdate(function () {
                for (var i = 0; i < polyAmm; i++) {
                    var curX = xCoords[i] * this.x;
                    polygonGroup[i].pos.x = curX;
                }
            })
            .onComplete(function () {
                stopAnimate = true;
                cleanCanvas();
            })
            .start();

        var tweenY = new TWEEN.Tween(coordY)
            .to({ y: wCoords.y }, par.dur.y)
            .easing(par.ease.y)
            .onUpdate(function () {
                for (var i = 0; i < polyAmm; i++) {
                    var curY = yCoords[i] * this.y;
                    polygonGroup[i].pos.y = curY;
                }
            })
            .start();

        var tweenR = new TWEEN.Tween(coordR)
            .to({ r: wCoords.r }, par.dur.r)
            .easing(par.ease.r)
            .onUpdate(function () {
                for (var i = 0; i < polyAmm; i++) {
                    var rot = rCoords[i] * this.r;
                    polygonGroup[i].rot = rot;
                }
            })
            .start();

        var coordO = { o: par.gap.opacity };
        var oCoords = 0;

        var tween = new TWEEN.Tween(coordO)
            .to({ o: oCoords }, par.dur.gap)
            .easing(par.ease.gap)
            .onUpdate(function () {
                document.getElementById("gap").style.opacity = this.o;
            })
            .start();
    }

    function getXCoord2() {
        var x = [];
        for (var i = 0; i < polyAmm; i++) {
            if (polygonGroup[i].center.x < cWidth / 2) {
                // left
                //console.log(1 , polygonGroup[i].center.x / 150);
                var boom = polygonGroup[i].center.x / 160;
                x.push(-cWidth * 2 - Math.random() * cWidth * 2.5 * boom);
            } else {
                //console.log(2, );
                var boom = 1 - (polygonGroup[i].center.x / 160 - 1);
                // right
                x.push(cWidth / 2 + Math.random() * cWidth * 2.5 * boom);
            }
        }
        return x;
    }

    function getYCoord2() {
        var y = [];
        for (var i = 0; i < polyAmm; i++) {
            if (polygonGroup[i].center.y < cHeight / 2) {
                var boom = polygonGroup[i].center.y / 125;

                y.push(-cHeight / 2 - (0.5 - Math.random()) * cHeight * 2.5 * boom);
            } else {
                var boom = 1 - (polygonGroup[i].center.y / 125 - 1);

                y.push(cHeight / 2 + (0.5 - Math.random()) * cHeight * 2.5 * boom);
            }
        }
        return y;
    }

    function getRCoord() {
        var r = [];
        for (var i = 0; i < polyAmm; i++) {
            r.push((0.5 - Math.random()) * 360);
        }
        return r;
    }




    function calPolygonCenter(id) {

        var newPol = [];
        for (var j = 0; j < polygonGroup[id].coords.length / 2; j++) {
            var num1 = polygonGroup[id].coords[j * 2];
            var num2 = polygonGroup[id].coords[j * 2 + 1];

            newPol.push({ x: num1, y: num2 });
        }

        var region = new Region(newPol);
        var center = region.centroid();

        return { x: Math.round(center.x), y: Math.round(center.y) };
    }

    function hideRepeat() {
        var el = document.getElementById("explodeRepeat");
        el.style.opacity = 0;
    }


    document.getElementById("adRect").addEventListener("click", clicked);

    function activateClickTag() {
        document.getElementById("adRect").addEventListener("click", clickTagEvent);
        _dsptr("finished");
    }

    function removeEvents() {
        document.getElementById("adRect").removeEventListener("click", clicked);
    }

    function clickTagEvent() {
        window.open(ctaUrl);

    }


    let lastX, lastY, lastZ;
    let moveCounter = 0;

    function motion(e) {
        let acc = e.acceleration;
        if (!acc.hasOwnProperty('x')) {
            acc = e.accelerationIncludingGravity;
        }

        if (!acc.x) return;

        if (Math.abs(acc.x) >= 1 &&
            Math.abs(acc.y) >= 1 &&
            Math.abs(acc.z) >= 1) {
            if (!lastX) {
                lastX = acc.x;
                lastY = acc.y;
                lastZ = acc.z;
                return;
            }

            let deltaX = Math.abs(acc.x - lastX);
            let deltaY = Math.abs(acc.y - lastY);
            let deltaZ = Math.abs(acc.z - lastZ);

            if (deltaX + deltaY + deltaZ > 3) {
                moveCounter++;
            } else {
                moveCounter = Math.max(0, --moveCounter);
            }

            if (moveCounter > 2) {
                shakeEvent();
                moveCounter = 0;
            }

            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;

        }
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    function Region(points) {
        this.points = points || [];
        this.length = points.length;
    }

    Region.prototype.area = function () {
        var area = 0,
            i,
            j,
            point1,
            point2;

        for (i = 0, j = this.length - 1; i < this.length; j = i, i++) {
            point1 = this.points[i];
            point2 = this.points[j];
            area += point1.x * point2.y;
            area -= point1.y * point2.x;
        }
        area /= 2;

        return area;
    };

    Region.prototype.centroid = function () {
        var x = 0,
            y = 0,
            i,
            j,
            f,
            point1,
            point2;

        for (i = 0, j = this.length - 1; i < this.length; j = i, i++) {
            point1 = this.points[i];
            point2 = this.points[j];
            f = point1.x * point2.y - point2.x * point1.y;
            x += (point1.x + point2.x) * f;
            y += (point1.y + point2.y) * f;
        }

        f = this.area() * 6;

        return new Point(x / f, y / f);
    };

    function makeClass() {
        var isInternal;
        return function (args) {
            if (this instanceof arguments.callee) {
                if (typeof this.init == "function") {
                    this.init.apply(this, isInternal ? args : arguments);
                }
            } else {
                isInternal = true;
                var instance = new arguments.callee(arguments);
                isInternal = false;
                return instance;
            }
        };
    }

    function degrees2rad(degrees) { return degrees * (Math.PI / 180) }
    function rad2degrees(radians) { return radians * (180 / Math.PI) }


    var explCoords = [[93.277, 110.664, 85.107, 118.091, 66.539, 131.831, 7.848, 167.207, 51.652, 193.476, 63.568, 153.741, 93.277, 110.664],
    [73.224, 158.568, 95.696, 152.347, 95.696, 152.347, 95.696, 152.347, 138.953, 140.372, 130.041, 121.061, 93.277, 110.664, 63.568, 153.741, 73.224, 158.568],
    [188.529, 73.342, 209.511, 121.061, 258.648, 129.766, 237.667, 92.839, 203.94, 75.168, 188.529, 73.342],
    [221.023, 171.937, 229.564, 231.725, 237.667, 235.438, 258.648, 129.766, 209.511, 121.061, 221.023, 171.937],
    [202.083, 214.643, 168.847, 197.98, 153.681, 240.545, 202.083, 214.643],
    [138.953, 140.372, 95.696, 152.347, 112.216, 171.937, 151.208, 178.25, 138.953, 140.372],
    [237.667, 92.839, 270.257, 59.667, 237.361, 0, 237.361, 0, 203.94, 75.168, 237.667, 92.839],
    [118.833, 84.775, 108.874, 96.552, 93.277, 110.664, 130.041, 121.061, 118.833, 84.775],
    [188.529, 73.342, 179.802, 64.616, 163.834, 31.565, 118.833, 84.775, 130.041, 121.061, 188.529, 73.342],
    [176.463, 83.187, 130.041, 121.061, 138.953, 140.372, 165.815, 153.741, 198.741, 155.597, 177.203, 117.348, 176.463, 83.187],
    [209.511, 121.061, 188.529, 73.342, 176.463, 83.187, 177.203, 117.348, 198.741, 155.597, 207.282, 167.207, 221.023, 171.937, 209.511, 121.061],
    [165.815, 153.741, 138.953, 140.372, 151.208, 178.25, 168.847, 197.98, 207.282, 167.207, 198.741, 155.597, 165.815, 153.741],
    [112.216, 171.937, 148.608, 211.424, 153.681, 240.545, 168.847, 197.98, 151.208, 178.25, 112.216, 171.937],
    [112.216, 171.937, 95.696, 152.347, 73.224, 158.568, 100.409, 232.846, 148.608, 211.424, 112.216, 171.937],
    [85.107, 118.091, 93.277, 110.664, 0, 88.011, 0, 121.061, 66.539, 131.831, 85.107, 118.091],
    [53.17, 203.873, 51.652, 193.476, 7.848, 167.207, 0, 171.937, 0, 228.754, 26.585, 216.314, 53.17, 203.873],
    [188.529, 73.342, 203.94, 75.168, 237.361, 0, 213.224, 0, 179.802, 64.616, 188.529, 73.342],
    [183.887, 0, 149.351, 0, 163.834, 31.565, 183.887, 0],
    [87.803, 45.703, 87.803, 45.703, 72.064, 75.168, 103.303, 92.467, 135.611, 0, 112.216, 0, 87.803, 45.703, 87.803, 45.703],
    [179.802, 64.616, 213.224, 0, 183.887, 0, 163.834, 31.565, 179.802, 64.616],
    [56.513, 44.191, 0, 24.509, 34.231, 54.218, 72.064, 75.168, 87.803, 45.703, 56.513, 44.191],
    [87.803, 45.703, 112.216, 0, 63.46, 0, 56.513, 44.191, 87.803, 45.703],
    [108.874, 96.552, 103.303, 92.467, 72.064, 75.168, 72.064, 75.168, 72.064, 75.168, 34.231, 54.218, 0, 54.218, 0, 88.011, 93.277, 110.664, 108.874, 96.552],
    [108.874, 96.552, 118.833, 84.775, 118.833, 84.775, 118.833, 84.775, 163.834, 31.565, 149.351, 0, 135.611, 0, 103.303, 92.467, 108.874, 96.552],
    [7.848, 167.207, 7.848, 167.207, 66.539, 131.831, 0, 121.061, 0, 171.937, 7.848, 167.207, 7.848, 167.207],
    [221.023, 171.937, 207.282, 167.207, 168.847, 197.98, 202.083, 214.643, 224.305, 194.916, 221.023, 171.937],
    [0, 54.218, 34.231, 54.218, 0, 24.509, 0, 24.509, 0, 54.218],
    [63.46, 0, 0, 0, 0, 24.509, 0, 24.509, 56.513, 44.191, 63.46, 0],
    [61.403, 250, 53.17, 203.873, 26.585, 216.314, 48.151, 250, 61.403, 250],
    [106.687, 250, 73.224, 158.568, 63.568, 153.741, 51.652, 193.476, 53.17, 203.873, 61.403, 250, 106.687, 250],
    [193.467, 250, 202.083, 214.643, 153.681, 240.545, 139.722, 250, 193.467, 250],
    [153.681, 240.545, 148.609, 211.424, 100.409, 232.846, 106.687, 250, 139.722, 250, 153.681, 240.545],
    [26.585, 216.314, 0, 228.754, 0, 250, 48.151, 250, 26.585, 216.314],
    [277.59, 250, 237.667, 235.438, 229.564, 231.725, 224.305, 194.916, 202.083, 214.643, 193.467, 250, 277.59, 250],
    [300, 0, 300, 64.616, 252.257, 0, 300, 0],
    [270.257, 59.667, 300, 84.775, 300, 64.616, 252.257, 0, 237.361, 0, 270.257, 59.667],
    [258.648, 129.766, 300, 84.775, 270.257, 59.667, 237.667, 92.839, 258.648, 129.766],
    [247.856, 184.119, 300, 225.333, 300, 250.26, 277.59, 250, 237.667, 235.438, 247.856, 184.119],
    [253.888, 153.741, 300, 146.499, 300, 225.333, 247.856, 184.119, 253.888, 153.741],
    [253.888, 153.741, 300, 146.499, 300, 84.775, 258.648, 129.766, 253.888, 153.741]]


    window.onload = function () {
        img.onload = init;
        img.src = image1;
    }

}

liteShake();