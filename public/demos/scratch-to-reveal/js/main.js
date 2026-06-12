// vars
var w = 300;
var h = 250;
var vs = 1; // viewport scale

var myDraggable = [];
var ctx, d;

var o = {};
var imgs = {};
var oNames = {
  id: "adArea dragEl canvas",
};

var mEvents = {
  mouseOver: false,
  touch: false,
};
function init() {
  setVars();
  initAnim();
  initDrag();
  doLoop();

  document.getElementById("pic2").style.position = 'absolute';
  document.getElementById("pic2").style.width = w*vs+'px';
  document.getElementById("pic2").style.height = h*vs+'px';
  document.getElementById("pic2").style.backgroundImage = "url("+slideImages[1]+")";
}

function setVars() {
  d = {
    shadeOpac: 0.5,
    iconS: 0.35,
    idleEnd: 6,
    end: false,
    time: {
      pause: false,
      last: new Date(),
      need: 2200, // anim
    },
    doLoop: true,
    dot: {
      list: [],
      need: 120,
    },
    drag: {
      idle: {
        cur: 0,
        need: 1500,
        last: new Date(),
      },
      active: false,
      cur: {
        x: 0,
        y: 0,
      },
      del: {
        x: 0,
        y: 0,
      },
      ft: false,
    },
  };
  ctx = o.canvas.getContext("2d");
}

function events() {}

function initAnim() {
  // automation
  var cnvs = document.getElementsByTagName('canvas');
  for(var i=0;i<cnvs.length;i++){
    cnvs[i].setAttribute('width', w*vs+'px');
    cnvs[i].setAttribute('height', h*vs+'px');
  }

  var els = document.getElementsByClassName('vs');
  for(var i=0;i<els.length;i++){
    els[i].style.width = w*vs+'px';
    els[i].style.height = h*vs+'px';
  }

  var els = document.getElementsByClassName('rct');
  for(var i=0;i<els.length;i++){
    els[i].style.width = w+'px';
    els[i].style.height = h+'px';
  }
  // automation end


  gsap.set([o.vs, o.pic2], { scale: 1 / vs, transformOrigin: "0% 0%" });
  gsap.set(o.shade, { opacity: d.shadeOpac });
  gsap.set(o.pic2Cont, { scale: 1.46 });

  ctx.drawImage(imgs.pic1, 0, 0);

  gsap.from(o.canvas, 0.5, {
    delay: 0.1,
    scale: 1.35,
    ease: "power2.out",
    transformOrigin: "50% 50%",
  });

  gsap.set(o.icon, { scale: d.iconS, opacity: 0 });
  d.iconTl = gsap.timeline({ repeat: -1 });
  d.iconTl.set(o.icon, { x: -30 });
  d.iconTl.to(
    o.icon,
    0.9,
    { x: 30, ease: "power1.inOut", yoyo: true, repeat: 1 },
    0
  );

  d.iconTl2 = gsap.to(o.icon, 0.85, { delay: 0.5, opacity: 1 });
}

function doLoop() {
  requestAnimFrame(doLoop);
  if (d.doLoop) {
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(imgs.pic1, 0, 0);
    placeDots();
  }
}

function placeDots() {
  // glow in
  ctx.globalCompositeOperation = "source-over";
  for (var i = 0; i < d.dot.list.length; i++) {
    placeGlowIn(d.dot.list[i]);
  }

  // erase
  ctx.globalCompositeOperation = "destination-out";
  for (var i = 0; i < d.dot.list.length; i++) {
    eraseDot(d.dot.list[i]);
  }
}

function placeGlowIn(dot) {
  var addS = 1.2;
  var addR = 3;
  var r = dot.r + addR + dot.r2;
  // ctx.fillStyle = "white";
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, r, 0, 360);
  ctx.fill();
}

function eraseDot(dot) {
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.beginPath();
  var r = dot.r + dot.r2;
  ctx.arc(dot.x, dot.y, r, 0, 360);
  ctx.fill();
}

function makeDots(x, y) {
  // console.log(x, y);
  var amm = 1 + Math.floor(4 * Math.random());
  for (var i = 0; i < amm; i++) {
    x += 22 * (0.5 - Math.random());
    y += 22 * (0.5 - Math.random());
    makeDot(x, y);
  }

  if (d.dot.list.length > d.dot.need && !d.end) {
    startEnd();
  }
}

function makeDot(x, y) {
  x *= vs;
  y *= vs;
  // console.log('doDot', x, y)

  var dot = {
    x: x,
    y: y,
    r: 5 + 20 * Math.random(),
    r2: 0,
  };
  var dur = 1 + 1 * Math.random();

  if (!d.end) {
    dot.tl = gsap.from(dot, 1.0, {
      r: 0,
      ease: "power3.out",
      onComplete: function () {
        gsap.to(dot, 3.5, { r: "+=" + 50, ease: "power1.inOut" });
      },
    });
  } else {
    var cr = dot.r;
    dot.r = 0;
    dot.tl = gsap.to(dot, 1.0, {
      r: cr * 2,
      ease: "power3.out",
      onComplete: function () {
        gsap.to(dot, 3.5, { r: "+=" + 50, ease: "power1.inOut" });
      },
    });
  }
  // gsap.to(dot, dur, {r: '+='+10, ease: 'power1.inOut', yoyo: true, repeat: -1})

  d.dot.list.push(dot);
}

function startEnd() {
  d.end = true;
  for (var i = 0; i < d.dot.list.length; i++) {
    var dot = d.dot.list[i];
    gsap.to(dot, 1.8, {
      r2: "+=" + 600,
      ease: "power2.in",
      onComplete: function () {},
    });
  }

  setTimeout(function () {
    myDraggable[0][0].disable();
    o.dragEl.style.display = "none";
    activateButtons();
    startEvent("Scratched");
    startEvent("Seen_Frame_2");
    startEvent("Seen_All");
    // startEvent("ended");
  }, 1000);

  setTimeout(function () {
    d.doLoop = false;
    o.canvas.style.display = "none";
  }, 1800);

  // reveal

  gsap.to(o.shade, 1, { delay: 0.1, opacity: 0 });

  var count = { val: 3, lv: 3 };
  gsap.to(count, 1, {
    delay: 0.1,
    val: 0,
    onUpdate: function () {
      var val = Math.round(count.val * 4) / 4;
      if (val != count.lv) {
        count.lv = val;
        o.pic2.style.filter = "blur(" + val + "px)";
      }
    },
  });

  gsap.to(o.pic2Cont, 1, { delay: 0.1, scale: 1, ease: "power1.inOut" });
}

/////////////////// D R A G ////////////////////////

var ammDragged = 0;

function initDrag(index) {
  myDraggable.push(addDraggable(o.dragEl));
}

function addDraggable(dragObj, name) {
  var drag = Draggable.create(dragObj, {
    //edgeResistance: 0.95, bounds: bounds, type:"x",
    onPress: function () {
      onPress(this);
    },
    onDrag: function (e) {
      onDrag(this, e);
    },
    onRelease: function (e) {
      onRelease(this);
    },
  });

  drag[0].name = name;
  // drag[0].alt = alt;

  return drag;
}

function onPress(el) {
  // console.log(el, this)
  if (!d.drag.ft) {
    d.drag.ft = true;

    startEvent("Main");
    startEvent("Seen_Frame_1");
    // startEvent("started");
    setTimeout(function () {
      if (!d.end) {
        startEnd();
      }
    }, d.idleEnd * 1000);

    d.iconTl2.kill();
    gsap.to(o.icon, 0.5, {
      opacity: 0,
      onComplete: function () {
        d.iconTl.kill();
        gsap.set(o.icon, { display: "none" });
      },
    });
  }
  d.drag.active = true;
  makeDots(el.pointerX, el.pointerY);
}

function onDrag(el, e) {
  makeDots(el.pointerX, el.pointerY);
}

function onRelease(el, endPos) {
  // console.log('onrelease')
  startEvent("Scratched");
  d.drag.active = false;
  gsap.set(el.target, { x: 0, y: 0 });
}

///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
////////////////// F U N C T I O N S //////////////////////
///////////////////////////

// SHAKE //

function activateButtons() {
  // o.adArea.addEventListener("mousedown", ctaFunction);
  o.adArea.addEventListener("pointerdown", ctaFunction);
}

/////////////////////////////

function getCssProperty(elmId, property) {
  var elem = document.getElementById(elmId);
  return parseInt(
    window.getComputedStyle(elem, null).getPropertyValue(property)
  );
}

function getTransformValue(element, property) {
  var values = element.style.transform.split(")");
  for (var key in values) {
    var val = values[key];
    var prop = val.split("(");
    if (prop[0].trim() == property) return prop[1];
  }
  return false;
}

function pitagor(a, b) {
  return Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5);
}
function easeInCubic(t) {
  return t * t * t;
}

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

var assetsCur = 0;
var assetsTotal = 0;
var allLoaded = false;

//

function initLoad() {
  prepareElements();
  setObjects();
  loadAsset(assets.init);
  mouseEvents();
}

function prepareElements() {
  // id
  var names = oNames.id.split(" ");
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    o[name] = document.getElementById(name);
  }
}

function loadOther() {
  assetsTotal = Object.size(assets);
  // console.log("assetsTotal");
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

function getFixed(num, fix) {
  if (fix != null) {
    var str = typeof str == "string" ? num : num.toString();
    var l = str.length;

    var a = fix - l;
    var zeros = "";

    for (var i = 0; i < a; i++) {
      zeros += "0";
    }

    num = zeros + str;
  }
  return num;
}

function loadAsset(a) {
  a.cur_asset_pack = 0;
  a.asset_packs = a.length;

  for (var k = 0; k < a.asset_packs; k++) {
    var names = a[k].names.split(" ");
    a[k].curLoad = 0;

    // console.log( a[k] )

    if (a[k].type == "seq") {
      // console.log( a[k] )

      for (var z = a[k].start; z < a[k].start + a[k].amm; z++) {
        z = getFixed(z, a[k].fixed);

        var id = a[k].names + z;
        // console.log("id", id)

        var img = new Image();
        var cont = document.getElementById(a[k].container);
        img.myCustomData = {
          name: a[k].names,
          index: z,
          id: id,
          k: k,
          container: cont,
        };

        img.onload = function () {
          var div = document.createElement("div");
          div.style.position = "absolute";
          div.style.width = this.width + "px";
          div.style.height = this.height + "px";
          div.style.backgroundImage = "url(" + this.src + ")";
          // div.style.display = "none";
          div.setAttribute("id", this.myCustomData.id);
          // console.log( this.myCustomData.container );
          this.myCustomData.container.appendChild(div);

          gsap.set(div, { autoAlpha: 0 });

          o[this.myCustomData.id] = div;

          a[this.myCustomData.k].loaded++;
          if (a[this.myCustomData.k].loaded == a[this.myCustomData.k].amm) {
            // console.log(111);
            countAsset(a, this.myCustomData.k, 1);
          }
        };

        img.src = assets_url + a[k].folder + "/" + id + "." + a[k].format;
      }
    } else if (a[k].type == "img") {
      for (var i = 0; i < names.length; i++) {
        // console.log(names[i]);

        var img = new Image();
        img.myCustomData = {
          total: names.length,
          a: a,
          name: names[i],
          numb: k,
        };
        img.onload = function () {
          // console.log(this);
          imgs[this.myCustomData.name] = this;

          countAsset(
            this.myCustomData.a,
            this.myCustomData.numb,
            this.myCustomData.total
          );
        };
        img.src = slideImages[0];
      }
    } else {
      for (var i = 0; i < names.length; i++) {
        var img = new Image();
        img.myCustomData = {
          total: names.length,
          a: a,
          name: names[i],
          numb: k,
        };
        img.onload = function () {
          o[this.myCustomData.name] = document.getElementById(
            this.myCustomData.name
          );

          var type = this.myCustomData.a[this.myCustomData.numb].type;
          var elAmm = 1;
          if (type == "class") {
            o[this.myCustomData.name] = document.getElementsByClassName(
              this.myCustomData.name
            );
            elAmm = o[this.myCustomData.name].length;
          }

          for (var j = 0; j < elAmm; j++) {
            // console.log(this.myCustomData.name);
            var el;
            if (type == "class") {
              el = o[this.myCustomData.name][j];
              el.style.backgroundImage = "url(" + this.src + ")";
            } else if (type == "id") {
              el = o[this.myCustomData.name];
              el.style.backgroundImage = "url(" + this.src + ")";
            } else if (type == "src") {
              // console.log( this.src );
              el = o[this.myCustomData.name];
              o[this.myCustomData.name].src = this.src;
            }

            el.style.position = "absolute";
            el.style.width = this.width + "px";
            el.style.height = this.height + "px";

            if (this.myCustomData.a[this.myCustomData.numb].scale != 1) {
              var scale = 1 / this.myCustomData.a[this.myCustomData.numb].scale;
              TweenMax.set(el, {
                scale: scale,
                left: -this.width / 4,
                top: -this.height / 4,
                transformOrigin: "50% 50%",
              });
            }
          }

          countAsset(
            this.myCustomData.a,
            this.myCustomData.numb,
            this.myCustomData.total
          );
        };
        img.src = assets_url + names[i] + "." + a[k].format;
      }
    }
  }
}

function countAsset(asset, o, total) {
  // console.log( "countAsset", asset, o, total );
  // console.log( "countAsset", asset[o].curLoad, total );

  asset[o].curLoad++;
  if (asset[o].curLoad == total) {
    // console.log("proceed", asset.cur_asset_pack, asset.asset_packs)
    asset.cur_asset_pack++;
    // console.log( asset.cur_asset_pack, asset.asset_packs )
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
    init();
    TweenMax.to(adArea, 0.3, { delay: 0.05, opacity: 1 });
    // loadMid();
    loadOther();
    // } else if(assetsCur == 2) {
    // loadEnd();

    // initDrag();
  } else if (assetsCur == assetsTotal) {
    allLoaded = true;
  }
}

//

Object.size = function (obj) {
  // get objects ammount in var
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function setObjects() {
  var divs = document.getElementsByTagName("div");
  for (var i = 0; i < divs.length; i++) {
    o[divs[i].id] = divs[i];
  }
}

function mouseEvents() {
  document.getElementById("adArea").addEventListener("mouseover", () => {
    if (!mEvents.mouseover) {
      mEvents.mouseover = true;
      startEvent("Mouse_Over");
    }
  });
  document.getElementById("adArea").addEventListener("touchstart", () => {
    if (!mEvents.touch) {
      mEvents.touch = true;
      startEvent("Touch");
    }
  });
}

if (window.addEventListener) {
  window.addEventListener("load", initLoad(), false);
} else if (window.attachEvent) {
  window.attachEvent("onload", initLoad());
}