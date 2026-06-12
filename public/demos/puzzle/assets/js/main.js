


// vars
var adArea = document.getElementById("adArea");
var w = 300;
var h = 250;

var completedNumb = 0;
var ftDrag = true;
var myDraggable = [];
var startX, startY;
var canvas, ctx;

var objects = {
    adArea: document.getElementById("adArea"),
    slide_2: document.getElementById("slide_2"),
    slide_0: document.getElementById("slide_0"),
    mozaicBoard: document.getElementById("mozaicBoard"),
    board: document.getElementById("board"),
    cta: document.getElementById("cta"),
    title: document.getElementById("title"),
    message: document.getElementById("message"),
    boxes: []
};

var bDef = {
    amm: 16,
    rows: 4,
    cols: 4,
    box: {
        w: 43,
        h: 43,
        space: 1
    },
    empty: {
        r: 3,
        c: 3,
        i: 15
    }
}

var answer = [
    [0, 1,]

]

var boxes = [];
var drags = [];
var cPos = []; // changed position
var bId = []; // changed position
//

function init() {
    createBoard();
    swapTiles();
    initAnimation();


    // initDrag();
    // setAllBounds();
    // myLoop();
}

function initGame() {
    initDrag();
    setAllBounds();

    // myLoop()
}
////////////////
function initAnimation() {
    TweenMax.from(objects.board, 1, { delay: 0.8, x: 300, ease: Back.easeIn.config(1.3) });
    TweenMax.from(objects.t1, 0.7, { delay: 0.0, y: 120, opacity: 1, ease: Back.easeOut });
    TweenMax.from(objects.t2, 0.7, { delay: 0.2, y: 120, opacity: 1, ease: Back.easeOut });
    TweenMax.from(objects.t3, 0.7, { delay: 0.7, y: 120, opacity: 1, ease: Back.easeOut })
    TweenMax.to(objects.t1, 0.7, { delay: 1.6, y: 230, opacity: 1, ease: Back.easeOut });
    TweenMax.to(objects.t2, 0.7, { delay: 1.8, y: 230, opacity: 1, ease: Back.easeOut });
    TweenMax.to(objects.t3, 0.7, { delay: 2, y: 230, opacity: 1, ease: Back.easeOut })
    TweenMax.to(objects.t1, 0.1, { delay: 2, opacity: 0 })
    TweenMax.to(objects.t2, 0.1, { delay: 2, opacity: 0 })
    TweenMax.to(objects.t3, 0.1, { delay: 2, opacity: 0 })
}

function swapTiles() {
    var dur = 0.2;
    var swapData = [
        { r: 3, c: 2 },
        { r: 2, c: 2 },
        { r: 2, c: 3 },
        { r: 3, c: 3 },
    ]

    var lastTo = { r: 3, c: 3 };
    for (var i = 0; i < swapData.length; i++) {
        (function (i, lastTo) {
            setTimeout(function () { doSwap(i, dur, swapData, lastTo) }, i * dur * 1000);
        }(i, lastTo));
        lastTo = swapData[i];
    }
    setTimeout(initGame, dur * swapData.length * 1000 + 200)
}

function doSwap(i, dur, swapData, lastTo) {
    console.log("doSwap", i);
    console.log(swapData[i].r, swapData[i].c);
    console.log(boxes[swapData[i].r][swapData[i].c].el);

    var el = boxes[swapData[i].r][swapData[i].c].el;

    var r = swapData[i].r;
    var c = swapData[i].c;

    var dy = (lastTo.r - r) * (bDef.box.h + 1);
    var dx = (lastTo.c - c) * (bDef.box.w + 1);

    var l = dx + boxes[r][c].pos.x;
    var t = dy + boxes[r][c].pos.y;

    TweenMax.to(el, dur, { left: l, top: t, ease: Power1.easeInOut })

    boxes[r][c].pos.x = l;
    boxes[r][c].pos.y = t;


    /////////////////////



    var ei = bDef.empty.i;
    var er = bDef.empty.r;
    var ec = bDef.empty.c;
    var bi = el.id0;
    var br = r;
    var bc = c;

    if (bDef.empty.c < 0) { console.log("XXXXXXXXXXXXXXXXXXXXX"); bDef.empty.c = bDef.rows - 1 }

    rearrangeBoxArray(er, ec, br, bc);

    bDef.empty.i = bi;
    bDef.empty.r = br;
    bDef.empty.c = bc;

    el.id0 = ei;
    el.r = er;
    el.c = ec;
}

function puzzleSolved() {
    secondsTook = secondsPass;

    dragsContr("kill");

    TweenMax.to(".tile", 0.01, { width: bDef.box.w + 1, height: bDef.box.h + 1, ease: Back.easeIn });
    TweenMax.to(".tile", 0.01, { css: { borderRadius: "0px" } });

    TweenMax.to(objects.board, 1, { delay: 0.4, x: 300, ease: Back.easeIn.config(1.3) });

    setTimeout(secondSlide, 1200);
}

var secondsPass = -1;
function startCounting() {
    secondsPass++;

    setTimeout(startCounting, 1000);
}

function secondSlide() {
    _dsptr("finished");
    setTimeout(activateButtons, 700)


    var messages = [
        { title: "Very good!" },
        { title: "Nice!" },
        { title: "Not Bad!" },
    ]

    var msg = "";
    if (secondsTook < 4) {
        msg = messages[0].title;
    } else if (secondsTook < 8) {
        msg = messages[1].title;
    } else {
        msg = messages[2].title;
    }


    objects.title.innerHTML = msg;
    objects.message.innerHTML = "You took " + secondsTook + "s to complete";

    TweenMax.set(objects.slide_2, { display: "block" })
    TweenMax.from(objects.frame2, 1, { delay: 0, y: 250, ease: Back.easeIn.config(1.3) });

}


function createBoard() {
    for (var r = 0; r < bDef.rows; r++) {
        boxes.push([]);
        drags.push([]);
        for (var c = 0; c < bDef.cols; c++) {
            cPos.push({ x: 0, y: 0 });

            var numb = r * bDef.cols + (c + 1);
            bId.push(numb - 1);

            var pos = getBoxPos(r, c);

            var dragEl = document.createElement("div");
            dragEl.setAttribute("id", "d" + numb);
            dragEl.style.position = "absolute";
            dragEl.style.width = bDef.box.w + "px";
            dragEl.style.height = bDef.box.h + "px";
            draggablesBoard.appendChild(dragEl);

            drags[r].push({ type: "box", el: dragEl, pos: { x: pos.x, y: pos.y }, pos0: { x: pos.x, y: pos.y }, d: { x: 0, y: 0 } });



            if (numb == bDef.amm) {
                boxes[r].push({ type: "empty", pos: pos, pos0: pos, d: { x: 0, y: 0 } });

            } else {


                var boxCont = document.createElement("div");
                boxCont.setAttribute("id", "b" + numb);
                boxCont.setAttribute("class", "tile");
                boxCont.style.position = "absolute";
                boxCont.style.left = pos.x;
                boxCont.style.top = pos.y;
                boxCont.style.width = bDef.box.w + "px";
                boxCont.style.height = bDef.box.h + "px";
                boxCont.style.textOverflow = "clip";
                boxCont.style.overflow = "hidden";
                boxCont.style.borderRadius = "3px";

                var boxBg = document.createElement("div");
                boxBg.style.position = "absolute";
                boxBg.style.width = (bDef.box.w + 1) + "px";
                boxBg.style.height = (bDef.box.h + 1) + "px";

                var boxPic = document.createElement("div");
                boxPic.style.position = "absolute";
                boxPic.style.width = (bDef.box.w + 1) + "px";
                boxPic.style.height = (bDef.box.h + 1) + "px";
                boxPic.style.backgroundImage = "url(" + objects.picture.src + ")";
                boxPic.style.backgroundRepeat = "no-repeat";
                var boxBgPos = { x: - pos.x, y: - pos.y };
                boxPic.style.backgroundPosition = boxBgPos.x + "px " + boxBgPos.y + "px";

                boxCont.appendChild(boxBg);
                boxCont.appendChild(boxPic);
                mozaicBoard.appendChild(boxCont);

                objects.boxes.push(boxCont);


                boxes[r].push({ type: "box", el: boxCont, pos: { x: pos.x, y: pos.y }, pos0: { x: pos.x, y: pos.y }, d: { x: 0, y: 0 } });
            }
        }
    }
}

function setAllBounds() {
    //console.log("empty", bDef.empty);
    for (var r = 0; r < bDef.rows; r++) {
        for (var c = 0; c < bDef.cols; c++) {
            var i = r * bDef.cols + (c);
            setBounds(r, c, i);
        }
    }
}

function setBounds(r, c, i) {
    if (drags[r][c].type == "box") {
        //console.log(i);
        var maxX = 0, maxY = 0, minX = 0, minY = 0;
        // cPos
        if (cPos[i].x > 0) { minX = cPos[i].x } else if (cPos[i].x < 0) { maxX = cPos[i].x }
        if (cPos[i].y > 0) { minY = cPos[i].y } else if (cPos[i].y < 0) { maxY = cPos[i].y }
        var w = bDef.box.w;
        var h = bDef.box.h;
        var ec = bDef.empty.c;
        var er = bDef.empty.r;

        if (er == r) {
            if (c == (ec - 1)) {
                maxX += w;
            }

            if (c == (ec + 1)) {
                minX -= w;
            }
        }

        if (ec == c) {
            if (r == (er - 1)) {
                maxY += h;
            }
            if (r == (er + 1)) {
                minY -= h;
            }
        }

        myDraggable[i][0].applyBounds({ minX: minX, minY: minY, maxX: maxX, maxY: maxY });
    }
}


function boxLand(el, ex, ey, startX, startY, r, c) {
    var idString = el.target.id;
    var numb = parseInt(idString.replace(/[^0-9\.]/g, ''), 10);


    var landPos = { x: 0, y: 0 }
    landPos.x = boxes[r][c].pos.x + side.x * (bDef.box.w + 1);
    landPos.y = boxes[r][c].pos.y + side.y * (bDef.box.h + 1);

    boxes[r][c].pos.x = landPos.x;
    boxes[r][c].pos.y = landPos.y;




    TweenMax.to(boxes[r][c].el, 0.25, {
        left: landPos.x, top: landPos.y, ease: Power1.easeOut, onComplete:
            function () {
                landHappen = false;
                bId[numb - 1] = bDef.empty.i;

                var ei = bDef.empty.i;
                var er = bDef.empty.r;
                var ec = bDef.empty.c;

                var bi = el.target.id0;
                var br = r;
                var bc = c;

                if (bDef.empty.c < 0) { console.log("XXXXXXXXXXXXXXXXXXXXX"); bDef.empty.c = bDef.rows - 1 }

                resetBoxPosition(el.target.id, br, bc, side);
                rearrangeBoxArray(er, ec, br, bc);

                bDef.empty.i = bi;
                bDef.empty.r = br;
                bDef.empty.c = bc;

                el.target.id0 = ei;
                el.target.r = er;
                el.target.c = ec;





                el.enable()

                setAllBounds();

                checkIfItsCorrect();


                dragsContr("enable");
            }
    });
}
var disableGame = false;
var disableOnAnim = false;
function checkIfItsCorrect() {
    var i = 0;
    var correct = 0;
    for (var r = 0; r < bDef.rows; r++) {
        for (var c = 0; c < bDef.cols; c++) {
            if (boxes[r][c].type == "box") {


                var idString = boxes[r][c].el.id;
                var myi = parseInt(idString.replace(/[^0-9\.]/g, ''), 10) - 1;



                if (i == myi) {
                    correct++;
                }
                i++;
            } else {
                if ((r == bDef.rows - 1) && (c == bDef.cols - 1)) {
                    correct++;
                }
            }
        }
    }



    if (correct == bDef.amm) {
        disableGame = true;
        puzzleSolved();
    }
}
function myLoop() {


    for (var r = 0; r < bDef.rows; r++) {
        var string = "";
        for (var c = 0; c < bDef.cols; c++) {
            string += boxes[r][c].type + " ";
        }
    }
}

function resetBoxPosition(id, br, bc, side) {

}

function rearrangeBoxArray(er, ec, br, bc) { 

    var tmpEl = {};
    tmpEl.pos = { x: boxes[br][bc].pos.x, y: boxes[br][bc].pos.y };
    tmpEl.el = boxes[br][bc].el;
    tmpEl.type = boxes[br][bc].type;
    tmpEl.d = {};
    tmpEl.d.x = boxes[br][bc].d.x;
    tmpEl.d.y = boxes[br][bc].d.y;

    boxes[br][bc].pos.x = boxes[er][ec].pos.x;
    boxes[br][bc].pos.y = boxes[er][ec].pos.y;
    boxes[br][bc].type = boxes[er][ec].type;
    boxes[br][bc].el = "none";
    boxes[br][bc].d.x = boxes[er][ec].d.x;
    boxes[br][bc].d.y = boxes[er][ec].d.y;

    boxes[er][ec].pos.x = tmpEl.pos.x;
    boxes[er][ec].pos.y = tmpEl.pos.y;
    boxes[er][ec].d.x = tmpEl.d.x;
    boxes[er][ec].d.y = tmpEl.d.y;
    boxes[er][ec].el = tmpEl.el;
    boxes[er][ec].type = tmpEl.type;


}

function getBoxPos(r, c) {
    var x = c * bDef.box.w + c;
    var y = r * bDef.box.h + r;
    return { x: x, y: y }
}

function initAnim() {

}


function endDragAnim() {
    console.log("endDragAnim");

    _dsptr("finished");
    setTimeout(activateButtons, 0)
}

var dragPar = {};

function initDrag() {
    for (var i = 0; i < bDef.amm; i++) {
        var r = getRow(i);
        var c = getColumn(i);
        if (drags[r][c].type != "empty") {
            myDraggable.push(addDraggable(drags[r][c].el, i, drags[r][c].pos, c, r));
        }
    }
}


function getRow(i) {
    return (i - i % (bDef.cols)) / (bDef.cols);
}
function getColumn(i) {
    return (i) % (bDef.rows);
}


function addDraggable(dragObj, id, pos, c, r) {
    dragObj.r = r;
    dragObj.c = c;
    dragObj.id0 = id;
    TweenLite.set(dragObj, { css: { left: pos.x, top: pos.y, opacity: 1 } });
    return Draggable.create(dragObj, {
        edgeResistance: 1,
        onPress: function () {
            onPress(this);
        },
        onDrag: function (e) {
            onDrag(this, id, r, c);
        },
        onDragEnd: function (e) {
            onDragEnd(this)
        },
        onRelease: function (e) {
            onRelease(this)
        }
    })
}

var dragFt = false;
var stopToggle = false;
function onPress(el) {
    if (!disableOnAnim) {

        if (!dragFt) {
            startCounting();
            _dsptr("started");
            dragFt = true;
            stopToggle = true;
        }
        // tldPos.kill();
        // console.log("minX:",el.minX,"maxX:", el.maxX,"minY:", el.minY,"maxY:", el.maxY);
        startX = getCssProperty(el.target.id, "left");
        startY = getCssProperty(el.target.id, "top");


        var curX = startX + el.x;
        var curY = startY + el.y;
        var ex = bDef.empty.c * bDef.box.w + bDef.empty.c;
        var ey = bDef.empty.r * bDef.box.h + bDef.empty.r;

        var dx = ex - curX;
        var dy = ey - curY;

        // console.log(dx, dy);

        side = { x: 0, y: 0 }
        if (dx > 0) {
            side.x = 1;
        }
        if (dx < 0) {
            side.x = -1;
        }
        if (dy > 0) {
            side.y = 1;
        }
        if (dy < 0) {
            side.y = -1;
        }
        // console.log(el.target.bounds);
    }
}

var disableOnDrag = false;
var side = { x: 0, y: 0 }
var landHappen = false;

function onDrag(el, id, r, c) {
    if (!disableOnAnim) {
        //console.log("onDrag", r, c);
        var curX = startX + el.x;
        var curY = startY + el.y;

        var near = 20; // near position allowed

        // empty position
        var ex = bDef.empty.c * bDef.box.w + bDef.empty.c;
        var ey = bDef.empty.r * bDef.box.h + bDef.empty.r;

        var b = el.target.bounds;

        numb = id;
        //console.log(id, el.x);


        // var r = getRow(id);
        // var c = getColumn(id);

        // var newPos = {x: boxes[r][c].pos.x + el.x + boxes[r][c].d.x, y: boxes[r][c].pos.y + el.y + boxes[r][c].d.y}

        var newPos = { x: 0, y: 0 }
        newPos.x = boxes[r][c].pos.x + el.x;
        newPos.y = boxes[r][c].pos.y + el.y;

        // TweenMax.set(boxes[r][c].el, {x: newPos.x, y: newPos.y});
        TweenMax.set(boxes[r][c].el, { left: newPos.x, top: newPos.y });


        if (((curX - near) < ex) && ((curX + near) > ex)) {
            if (((curY - near) < ey) && ((curY + near) > ey)) {
                // disableOnAnim = true;
                //console.log("SWAP HAPPENING", r, "<->", bDef.empty.r, ", ", c, "<->", bDef.empty.c);
                landHappen = true;
                // el.disable();
                dragsContr("disable");

                boxLand(el, ex, ey, startX, startY, r, c);
                TweenMax.to(el.target, 0.1, { x: 0, y: 0, ease: Back.easeOut });
            }
        }

    }
}
var lastX, lastY;

function dragsContr(mode) {
    for (var i = 0; i < myDraggable.length; i++) {
        var el = myDraggable[i][0];

        switch (mode) {
            case "disable":
                el.disable();
                break;
            case "enable":
                el.enable();
                break;
            case "kill":
                el.kill();
                break;
        }
    }
}

function onDragEnd(el) {
    var curX = startX + el.x;
    var curY = startY + el.y;
}

function onRelease(el) {
    if (!disableOnAnim) {
        var idString = el.target.id;
        var i = parseInt(idString.replace(/[^0-9\.]/g, ''), 10) - 1;

        var r = getRow(i);
        var c = getColumn(i);


        //	console.log("onrelease dx dy::", boxes[r][c].d, el.target.id, r, c);

        TweenMax.to(el.target, 0.25, { x: 0, y: 0, ease: Back.easeOut });

        if (!landHappen) {
            //	console.log("!landHappen", boxes[c][r].el);

            // var newPos = {x: boxes[r][c].pos.x + el.x + boxes[r][c].d.x, y: boxes[r][c].pos.y + el.y + boxes[r][c].d.y}
            // TweenMax.set(boxes[r][c].el, {left: newPos.x, top: newPos.y});

            TweenMax.to(boxes[r][c].el, 0.25, { left: boxes[r][c].pos.x, top: boxes[r][c].pos.y, ease: Back.easeOut });
        }

        // console.log(i, cPos);
    }
}


function dropProduct(el, curX, curY, hit, pos) {
    endStarting();
}


function endStarting() {
    disableOnDrag = false;
    completedNumb++;
    // if(completedNumb == totHits){
    setTimeout(endDragAnim, 800);
    // }
}

////////////////// F U N C T I O N S //////////////////////
///////////////////////////

function activateButtons() {
    adArea.addEventListener("click", ctaFunction);
}

function removeButtons() {
    adArea.removeEventListener("click", ctaFunction);
}

/////////////////////////////


function getCssProperty(elmId, property) {
    var elem = document.getElementById(elmId);
    return parseInt(window.getComputedStyle(elem, null).getPropertyValue(property));
}

function getTransformValue(element, property) {
    var values = element.style.transform.split(")");
    for (var key in values) {
        var val = values[key];
        var prop = val.split("(");
        if (prop[0].trim() == property)
            return prop[1];
    }
    return false;
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