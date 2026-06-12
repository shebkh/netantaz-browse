// images


// vars
var w = 300;
var h = 600;

var myDraggable = [];
var startX, startY;
var inactive = true;
var d;
var ausines;
var controls;

var o = {};
var oNames = {
    id: 'c1 c2 c3 c4 c5 adArea ui1 ui2 container horCont verCont dragEl ctaArea cursorCont textCont ctaCont',
}
var anim0_ended = true;

function init() {
    initTHREE();
    setVars();
    // loadTextures();
    loadModel();
    events();
}

function initAd() {
    console.log('initAd')
    initDrag();
    prepModel();
    addLights();
    prepBerry();
    addGround();

    setTimeout(function () {
        initAnim();
        initPhoneAnim();


    }, 500)

    render();

    console.log('allDone')

    TweenMax.to(adArea, 0.3, { delay: 0.01, opacity: 1 });

}

function events() {
    o.ctaArea.addEventListener("click", ctaFunction);
    mouseEvents();
}


var dd = {
    mouseOver: false,
    touch: false,
    dir: "",
    frameSeen: 1,
};

function mouseEvents() {
    //mouse over
    adArea.addEventListener("mouseover", function () {
        if (!dd.mouseOver && !dd.touch) {
            dd.mouseOver = true;
            startEvent("Mouse_Over");
        }
    });

    //touch
    adArea.addEventListener("touchstart", function () {
        if (!dd.mouseOver && !dd.touch) {
            dd.touch = true;
            startEvent("Touch");
        }
    });
}





var rotSide = 1;

function setVars() {
    d = {
        splash: {
            active: false,
            list: [],
        },
        doLoop: true,
        rr: 0,
        rry: 0,
        // model_url: "Juice_Tetrapack_Mojito (1).gltf",
        model_url: "can_2.glb",
        rot: 0,
        roty: 0,
        rot2: 0,
        rot3: 0,
        rot2y: 0,
        dragrotsum: 0,
        dragrotsumy: 0,
        dragrot: 0,
        dragroty: 0,
        pivotPoint: null,
        cardTop: null,
        cardBot: null,
        texLoaded: 0,
        texTotal: 0,
        tex: {},
        doRot: false,
        dots: {
            list: [],
        },
        sprites: {
            list: [],
        },
        drops: {
            amm: 200,
            list: [],
        },
        cam: {
            animx: 0,
            animy: 9.4,
            animz: 0,
            anim1: 0,
            start: { x: 0, y: 2, z: 0 },
            cur: { x: 0, y: 0, z: 0 },
            del: { x: 0, y: 0, z: 0 },
            a1: { x: 0, y: 0, z: 0 },
            a2: { x: 0, y: 0, z: 0 },
            a3: { x: 0, y: 0, z: 0 },
            a1Pwr: 1,
        },
        camLook: {
            x: 0,
            y: 0,
            z: 0,
        },
        drag: {
            active: true,
            cur: 0,
            cury: 0,
            del: 0,
            dely: 0,
        },
    }

    d.cam.cur.x = d.cam.start.x;
    d.cam.cur.y = d.cam.start.y;
    d.cam.cur.z = d.cam.start.z;

}

function init3dAnim() {
    console.log('init3dAnim');
    var del = 0.2;

    gsap.to(o.bg, 0.8, { delay: del, opacity: 1 })

    // ui

    o.ui1.style.display = "flex";
    o.ui2.style.display = "flex";
    gsap.set([o.logo], { autoAlpha: 1 })
    gsap.set([o.ctaCont, o.textCont], { autoAlpha: 1 })
    gsap.set(o.textCont, { scale: 0, transformOrigin: '50% 20%' })
    gsap.set(o.ctaCont, { scale: 0, transformOrigin: '50% 90%' })
    gsap.to(o.textCont, 1.4, { delay: 1.5, scale: 1, ease: 'elastic.out' })
    gsap.to(o.ctaCont, 0.8, { delay: 2.0, scale: 1, ease: 'back.out' })


    // o.container.style.display = "block";

    setTimeout(function () {
        // o.container.style.opacity = 1;

        // berries
        for (var i = 0; i < d.sprites.list.length; i++) {
            var b = d.sprites.list[i];
            var dur = 1.7 + 0.7 * Math.random();
            gsap.to(b, dur, { delay: 0.2 + 1 * Math.random(), addY: 0, ease: 'power3.out' })
        }

        var totDur = 1.5;
        var e1 = 'power1.in';
        var e2 = 'power1.out';
        var e3 = 'power2.in';
        var e4 = 'power2.out';
        var bounces = 5;
        var y0 = 4;
        var lastY = y0;

        var dur = 0.35;

        var rotAmm = 0.3;
        var rotDec = 0.5;
        var xrot = -2 * rotAmm;
        var yrot = 1 * rotAmm;
        var zrot = -0.8 * rotAmm;
        var rotSide = -1;
        var addY = 0.33;
        var addFirstDur = 0.1;

        var tl = gsap.timeline({ delay: 0.1 });
        var tl2 = gsap.timeline({ delay: 0.1 });

        tl.set(allCan.position, { y: y0 })
        tl2.set(allCan.rotation, { x: xrot, y: yrot, z: zrot })

        tl.to(allCan.position, dur + addFirstDur, { y: 0, ease: e1 })
        tl2.to(allCan.rotation, dur + addFirstDur, { x: 0, y: 0, z: 0, ease: e1 })

        for (var i = 0; i < bounces; i++) {
            lastY *= 0.3;
            dur *= 0.77;
            tl.to(allCan.position, dur, { y: lastY, ease: e2 })
            tl.to(allCan.position, dur, { y: 0, ease: e1 })

            xrot *= rotDec * rotSide;
            yrot += addY;
            zrot *= rotDec * rotSide;
            // console.log(xrot)

            tl2.to(allCan.rotation, dur, { x: xrot, z: zrot, ease: e4 })
            yrot += addY;
            tl2.to(allCan.rotation, dur, { x: 0, z: 0, ease: e3 })

            addY *= 0.85;
        }

        setTimeout(() => {
            o.container.style.display = "block";
            gsap.to(o.container, 0.2, { delay: 0.1, opacity: 1 })
        }, 100);

    }, 200);

}




function addGround() {
    const geometry = new THREE.PlaneGeometry(5, 5);
    // const material = new THREE.MeshBasicMaterial( {
    //   color: 0xffffff, 
    //   side: THREE.DoubleSide
    // } );

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    })

    var material = new THREE.ShadowMaterial({
        opacity: 0.3,
        side: THREE.DoubleSide
    });


    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.set(90 * Math.PI / 180, 0, 0);
    plane.position.y = -0.8;

    plane.castShadow = false;
    plane.receiveShadow = true;

    scene.add(plane);
}

function prepBerry() {
    var img_names = [
        'c1',
        'c2',
        'c3',
        'c4',
        'c5',
        'l1',
        'l2',
        'l3',
        'l4',
        'l5',
    ]

    var amm = 19;

    for (var i = 0; i < amm; i++) {
        var rn = Math.floor(img_names.length * Math.random())
        var imgEl = o[img_names[rn]];
        // console.log(imgEl);

        var url = assets_url + img_names[rn] + '.png';

        // console.log( url );

        const map = new THREE.TextureLoader().load(url);

        map.magFilter = THREE.NearestFilter;
        map.minFilter = THREE.LinearMipMapLinearFilter;
        map.anisotropy = renderer.capabilities.getMaxAnisotropy();
        map.encoding = THREE.sRGBEncoding;

        const material = new THREE.SpriteMaterial({
            map: map,
            fog: false,
        });



        const sprite = new THREE.Sprite(material);

        var s = 0.15 + 0.15 * Math.random();

        var dist = 0.5 + 1 * Math.random();
        var y0 = 0.22;
        var height = 1.65;
        var rAngle = Math.random() * 360;
        var y = y0 + height * (0.5 - Math.random());
        var x = (dist * Math.cos(2 * Math.PI * rAngle));
        var z = (dist * Math.sin(2 * Math.PI * rAngle));

        sprite.position.set(x, y, z);
        sprite.scale.set(s, s, s)

        scene.add(sprite);

        var s = {
            el: sprite,
            rot: 0.5 - Math.random(),
            a: Math.random(),
            b: Math.random(),
            y: y,
            addY: 4,
        }

        d.sprites.list.push(s);
    }

}


function addLights() {

    var dec = 0.6;

    var lc2 = 0xd7d4ca;
    var lc1 = 0xffffff;

    var light1 = new THREE.PointLight(lc1);
    light1.position.set(-30, 2, -40);
    light1.intensity = .5 * dec;
    light1.castShadow = false;
    scene.add(light1);
    var light2 = new THREE.PointLight(lc1);
    light2.position.set(-15, -15, -5);
    light2.intensity = 0.7 * dec;
    light2.castShadow = false;
    scene.add(light2);

    var light3 = new THREE.PointLight(lc1);
    light2.position.set(13, 5, 13);
    light2.intensity = 0.6 * dec;
    light2.castShadow = false;
    scene.add(light2);

    var light = new THREE.DirectionalLight(lc1, 5)
    light.position.set(11, 16, 5);
    light.intensity = 0.35 * dec;
    light.castShadow = true
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 25
    light.shadow.camera.left = -10
    light.shadow.camera.right = 10
    light.shadow.camera.top = 10
    light.shadow.camera.bottom = -10
    light.shadow.radius = 5
    light.shadow.blurSamples = 25
    scene.add(light)

    var light = new THREE.AmbientLight(lc1, 0.1 * dec);
    scene.add(light);
}

var phone;
var meshes = [];
var gltf;
var modelPart;


function prepModel() {

    console.log('prepModel')

    console.log(gltf.scene)

    phone = gltf.scene;

    var s = 9;

    phone.scale.set(s, s, s)
    phone.position.set(0, 2, 0)

    // scene.add( phone );

    prepTex();

    console.log(scene)

    phone.traverse((obj) => {

        // obj.material = black_mat;

        // console.log('traverse', obj) 

        if (obj.isMesh && obj.geometry) {
            obj.geometry.computeBoundingSphere();
        }

        if (obj.type == 'Mesh') {

            obj.castShadow = true;
            obj.receiveShadow = true;

            /////////// SET MATERIALS ////////////////
            console.log(obj.name)
            if (obj.name == 'Blueberry') {
                modelPart = obj;
            }

        }

    })


    allCan = new THREE.Group();
    allCan.add(phone);
    scene.add(allCan);
}

var allCan;
var mats = {};

// const GUI = lil.GUI;
// const gui = new GUI();

function prepTex() {

    // const params = {
    //   radius: 0
    // }

    // gui.add( params, 'radius', 0, 100, 1).onChange( ()=>{} );   


    // d.tex.bottle_r.flipY = false;
    // d.tex.tex1.flipY = false;
    // d.tex.tex2.flipY = false;
    // d.tex.bottle_tex.flipY = false;
    // d.tex.cap_tex.flipY = false;

    // mats.can = new THREE.MeshPhysicalMaterial( {
    //   // color: 0x000000,
    //   reflectivity: 1,
    //   metalness: .0,
    //   roughness: .6,
    //   envMapIntensity: 0.85,
    //   specularIntensity: 0.82,

    //   clearcoat: 0.25,
    //   clearcoatRoughness: 0.4,

    //   transmission: .0,
    //   // reflectivity: 0.0,
    //   ior: 1.3,
    //   // map: d.tex.oth_map_1, 
    //   clearcoar: 0.44,
    //   clearcoatRoughness: 0.32,


    //   emissiveIntensity: 1,
    //   emissiveMap: d.tex.tex1,

    // } );


    // gui.add( mats.can, 'reflectivity', 0, 1, 0.02).name('reflectivity') 
    // gui.add( mats.can, 'sheen', 0, 1, 0.02).name('sheen') 
    // gui.add( mats.can, 'sheenRoughness', 0, 1, 0.02).name('sheenRoughness') 
    // gui.addColor(mats.can, "sheenColor").name('sheenColor')
    // gui.add( mats.can, 'ior', 0, 3, 0.02).name('ior') 
    //   gui.add( mats.can, 'metalness', 0, 1, 0.02).name('metalness') 
    // gui.add( mats.can, 'envMapIntensity', 0, 1, 0.02).name('envMapIntensity') 
    // gui.add( mats.can, 'emissiveIntensity', 0, 1, 0.02).name('emissiveIntensity') 
    // gui.add( mats.can, 'specularIntensity', 0, 1, 0.02).name('specularIntensity') 
    // gui.add( mats.can, 'roughness', 0, 1, 0.02).name('roughness') 
    // gui.addColor(mats.can, "specularColor").name('specularColor')
    // gui.add( mats.can, 'clearcoat', 0, 1, 0.02).name('clearcoat') 
    // gui.add( mats.can, 'clearcoatRoughness', 0, 1, 0.02).name('clearcoatRoughness') 



    // mats.bottle = new THREE.MeshPhysicalMaterial( {
    //   color: 0xfdcc2b,

    //   metalness: 0.02,
    //   roughness: 0.18,
    //   envMapIntensity: 0.2,
    //   specularIntensity: 1.0,

    //   reflectivity: 0.33,

    //   sheen: 0.82,
    //   sheenRoughness: 0.18,
    //   sheenColor: 0xffde0a,

    //   specularColor: 0xffffff,

    //   clearcoat: 0.66, // 0,5
    //   clearcoatRoughness: 0.4,
    //   clearcoatRoughnessMap: d.tex.bottle_r, 

    //   transmission: .92,
    //   ior: 1.46,
    //   roughnessMap: d.tex.bottle_r, 

    //   transparent: true,
    // } );

    // gui.addColor(mats.bottle, "color").name('color')

    // gui.add( mats.bottle, 'reflectivity', 0, 1, 0.02).name('reflectivity') 
    // gui.add( mats.bottle, 'sheen', 0, 1, 0.02).name('sheen') 
    // gui.add( mats.bottle, 'sheenRoughness', 0, 1, 0.02).name('sheenRoughness') 
    // gui.addColor(mats.bottle, "sheenColor").name('sheenColor')
    // gui.add( mats.bottle, 'ior', 0, 3, 0.02).name('ior') 
    // gui.add( mats.bottle, 'transmission', 0, 1, 0.02).name('transmission') 
    // gui.add( mats.bottle, 'metalness', 0, 1, 0.02).name('metalness') 
    // gui.add( mats.bottle, 'envMapIntensity', 0, 1, 0.02).name('envMapIntensity') 
    // gui.add( mats.bottle, 'specularIntensity', 0, 1, 0.02).name('specularIntensity') 
    // gui.add( mats.bottle, 'roughness', 0, 1, 0.02).name('roughness') 
    // gui.addColor(mats.bottle, "specularColor").name('specularColor')
    // gui.add( mats.bottle, 'clearcoat', 0, 1, 0.02).name('clearcoat') 
    // gui.add( mats.bottle, 'clearcoatRoughness', 0, 1, 0.02).name('clearcoatRoughness') 


    // gui.add( uniforms.thicknessDistortion, 'value', 0, 2, 0.05).name('thicknessDistortion') 
    // gui.add( uniforms.thicknessAmbient, 'value', 0, 4, 0.05).name('thicknessAmbient') 
    // gui.add( uniforms.thicknessAttenuation, 'value', 0, 4, 0.05).name('thicknessAttenuation') 
    // gui.add( uniforms.thicknessPower, 'value', 0, 4, 0.05).name('') 
    // gui.add( uniforms.thicknessScale, 'value', 0, 20, 0.05).name('thicknessScale') 


    // mats.caps = new THREE.MeshPhysicalMaterial( {
    //   color: 0x000000,
    //   metalness: .1,
    //   roughness: .05,
    //   envMapIntensity: 0.5,
    //   specularIntensity: 0.5,

    //   clearcoat: 0.1,
    //   clearcoatRoughness: 0.2,

    //   transmission: .0,
    //   // reflectivity: 0.0,
    //   ior: 2.0,
    //   map: d.tex.cap_tex, 
    //   bumpMap: d.tex.cap_tex, 
    //   bumpScale: 0.03,
    // } );


    // const shader = THREE.SubsurfaceScatteringShader;
    // const uniforms = THREE.UniformsUtils.clone( shader.uniforms );


    // uniforms[ 'diffuse' ].value = new THREE.Vector3( 0.93, 0.72, 0.0 );
    // uniforms[ 'shininess' ].value = 30;
    // uniforms[ 'thicknessColor' ].value = new THREE.Vector3( 1.0, 1.0, 1.0 );
    // uniforms[ 'thicknessDistortion' ].value = 0.1;
    // uniforms[ 'thicknessAmbient' ].value = 0.4;
    // uniforms[ 'thicknessAttenuation' ].value = 0.8;
    // uniforms[ 'thicknessPower' ].value = 2.0;
    // uniforms[ 'thicknessScale' ].value = 16.0;
    // mats.liquid = new THREE.ShaderMaterial( {
    //   uniforms: uniforms,
    //   vertexShader: shader.vertexShader,
    //   fragmentShader: shader.fragmentShader,
    //   lights: true
    // } );
    // mats.liquid.extensions.derivatives = true;

}




function loadModel() {
    var loader = new THREE.GLTFLoader();

    loader.load(assets_url + d.model_url, function (obj_all) {

        gltf = obj_all;
        d.modelLoaded = true;
        checkIfAllLoaded();

    }, undefined, function (error) {

        console.error(error);

    });
}

function loadTextures() {
    var tex = [
        ["bottle_r", "jpg"],
        ["cap_tex", "png"],
        ["bottle_tex", "png"],
        ["tex1", "jpg"],
        ["tex2", "jpg"],
        ["env", "jpg"],
    ];

    d.texTotal = tex.length;

    for (var i = 0; i < tex.length; i++) {

        var name = tex[i][0];
        var format = tex[i][1];
        var fullName = name + '.' + format;
        var url = assets_url + fullName;

        loadTexture(url, name);

    }

}

var texLoader = new THREE.TextureLoader();

function loadTexture(url, name) {

    texLoader.load(
        url,

        function (texture) {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            texture.needsUpdate = true;
            texture.encoding = THREE.sRGBEncoding;

            d.tex[name] = texture;
            d.texLoaded++;
            checkTexLoad();
        },
        undefined,
        function (err) {
            console.error('An error happened.');
        }
    );

}

function checkTexLoad() {
    if (d.texLoaded == d.texTotal) {
        d.texLoaded = true;
        checkIfAllLoaded();
    }
}

function checkIfAllLoaded() {
    // if(d.modelLoaded && d.texLoaded && anim0_ended){
    if (d.modelLoaded && anim0_ended) {
        // console.log('--- ALL LOADED ---')
        initAd();
    }
}


function initAnim() {
    console.log('initAnim');



    // cursor
    gsap.set(o.cursorCont, { perspective: 800 })

    gsap.set(o.cursor, { scale: 0.65, y: 265, opacity: 0 })
    d.cursorTl = gsap.timeline({ repeat: -1, delay: 2, repeatDelay: 0 })

    var dur = 0.4;

    d.cursorTl.set(o.cursor, { x: -80, rotationY: -80, opacity: 0 })
    d.cursorTl.to(o.cursor, dur, { x: 0, rotationY: 0, opacity: 1, ease: 'power2.out' })
    d.cursorTl.to(o.cursor, dur, { x: 80, rotationY: 80, opacity: 0, ease: 'power2.in' })

}


function initPhoneAnim() {
    var add_del = 0.35;
    var glob_y = -0.8;
    camera.position.set(0, 0.75 + glob_y, 2.2);
    camera.lookAt(0, 0, 0);

    phone.position.set(0, -0.0 + glob_y, 0)
    phone.rotation.y = (-136) * Math.PI / 180
    phone.rotation.z = 0 * Math.PI / 180
    phone.rotation.x = 0 * Math.PI / 180


    d.doRot = true;

    var rad1 = -10 * Math.PI / 180;
    var rad2 = 10 * Math.PI / 180;
    gsap.set(d, { rot: rad1 })
    gsap.to(d, 1.5, { delay: add_del, rot: rad2, ease: Power1.easeInOut, yoyo: true, repeat: -1 })

}

var scene, camera, renderer, clock, uniforms, particles;

function initTHREE() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xb7ceff, 1, 6);

    camera = new THREE.PerspectiveCamera(65, w / h, 0.01, 1000);
    camera.position.set(0, 0, 1.5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(w, h);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    o.container.appendChild(renderer.domElement);
    o.container.style.display = "none";

    var loader = new THREE.TextureLoader();
    loader.load('images/env.jpg', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.environment = texture;
    });

    clock = new THREE.Clock();
}


function endDrag() {
    // myDraggable[0][0].disable();
    d.drag.active = false;

    d.tlMain.timeScale(1.0);
    TweenMax.to(d.cam, 1.5, {
        a1Pwr: 0, ease: Power1.easeInOut, onComplete: function () {

            startSnow();
            TweenMax.to(uniforms.size, 1, { delay: 0.5, value: 0.025, ease: Power1.easeOut });
        }
    })
}

var manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
};

var modelVisible = false;
const frustum = new THREE.Frustum();
const cameraViewProjectionMatrix = new THREE.Matrix4();
function checkVisibility() {
    console.log('checkVisibility')
    camera.updateMatrixWorld(); // Update the camera matrix
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

    if (modelPart) {
        if (frustum.intersectsObject(modelPart)) {
            console.log("Model is visible");
            modelVisible = true;
            init3dAnim();
        } else {
            // console.log("Model is not visible");
        }
    }
}

var lastTime = Date.now();

var addAngle = 0;
var render = function () {
    requestAnimationFrame(render);

    var curTime = Date.now();
    var dt = curTime - lastTime;
    lastTime = curTime;
    if (pressed) {
        pressTime += dt;
    }
    // console.log(pressTime)

    if (uniforms) uniforms.time.value = clock.getElapsedTime();
    ausines = phone;

    if (d.doRot) {
        if (ausines) {

            dr = (d.dragrot + d.dragrotsum) - d.rot2;
            var dry = (d.dragroty + d.dragrotsumy) - d.rot2y;
            d.rot2 += dr / 5;


            d.rot3 *= 0.95;

            // d.rot2y += dry / 5;
            // d.rot2y *= 0.95;

            var radius = 2.4;
            var speed = 0.2;

            addAngle += 0.0013 * rotSide;
            var angle = d.rot2 * speed + addAngle;
            var y = 0;
            var addCamY = 0.12; // 0.12

            var x = (radius * Math.cos(2 * Math.PI * angle));
            var z = (radius * Math.sin(2 * Math.PI * angle));

            camera.position.x = x;
            camera.position.z = z;
            camera.position.y = y;

            camera.lookAt(0, addCamY, 0);

            // allCan.position.y = Math.abs(d.rot3*0.01);

            // berries
            for (var i = 0; i < d.sprites.list.length; i++) {
                var b = d.sprites.list[i];
                b.el.material.rotation += b.rot * 0.02;

                // console.log(b)

                b.el.position.y = b.addY + b.y + 0.2 * b.a * Math.sin(0.0020 * b.b * lastTime + 184 * b.a);

            }

        }
    }

    renderer.render(scene, camera);

    if (!modelVisible) {
        checkVisibility();

        // init3dAnim();
        // modelVisible = true;
    }
};



/////////////////// D R A G ////////////////////////

var startX, startY;
var dragFt = false;
var dragAmm = 0;

function initDrag() {
    var bounds = { top: -60, left: -90, width: w + 180, height: h + 120 };
    myDraggable.push(addDraggable(o.dragEl, bounds));
}

function addDraggable(dragObj, bounds) {
    // console.log('addDraggable', dragObj)
    return Draggable.create(dragObj, {
        edgeResistance: 0.8, bounds: bounds,
        onPress: function (e) {
            onPress(this, e);
        },
        onDrag: function (e) {
            onDrag(this, e);
        },
        onRelease: function (e) {
            onRelease(this, e);
        }
    })
}


var lastXdrag = 0;
var dragDX = 0;
var pressTime = 0;
var pressed = false;

function onPress(el, e) {
    console.log('onPress')
    if (!dragFt) {
        startEvent("Main");
        dragFt = true;

        gsap.to(o.cursorCont, 0.3, {
            autoAlpha: 0, onComplete: function () {
                d.cursorTl.kill();
            }
        })
    }

    pressed = true;
    pressTime = 0;

    dragAmm = 0;
    lastXdrag = 0;
    startX = getCssProperty(el.target.id, "left");

    var rn1 = 0.45 * (0.5 - Math.random())
    var rn2 = 0.45 * (0.5 - Math.random())
    gsap.to(allCan.position, 0.3, { y: 0.35, ease: 'power1.inOut' })
    gsap.to(allCan.rotation, 0.3, { x: rn1, z: rn2, ease: 'power1.inOut' })
}

function onDrag(el, e) {
    var curX = startX + el.x;
    d.drag.cur = curX;
    d.drag.cury = el.y;
    var deg = curX * 1.5;
    var degy = el.y * 1.5;
    rad = deg * Math.PI / 180;
    var rady = degy * Math.PI / 180;
    d.dragrot = rad;
    d.dragroty = rady;
    dragAmm++;

    dragDX = lastXdrag - curX;
    d.rot3 += dragDX;
    lastXdrag = curX;

    var da = 0.45;
    if (d.dragrotsumy + d.dragroty > da) {
        d.dragroty = 0;
        d.dragrotsumy = da;
    } else if (d.dragrotsumy + d.dragroty < -da) {
        d.dragroty = 0;
        d.dragrotsumy = -da;
    }
}

function onRelease(el, e) {
    var curX = startX + el.x;

    var minDegAmm = 3;
    if (curX > minDegAmm) {
        rotSide = 1;
    } else if (curX < -minDegAmm) {
        rotSide = -1;
    }

    pressed = false;

    gsap.to(allCan.position, 0.3, { y: 0, ease: 'bounce.out' })
    gsap.to(allCan.rotation, 0.3, { x: 0, z: 0, ease: 'power1.out' })


    if (dragAmm <= 2 && pressTime < 120) {
        ctaFunction();
    }

    d.dragrotsum += d.dragrot;
    d.dragrotsumy += d.dragroty;
    d.dragrot = 0;
    d.dragroty = 0;

    TweenMax.to(d.drag, 0.2, { cur: 0 });
    TweenMax.set(el.target, { x: 0, y: 0 });
}




////////////////// F U N C T I O N S //////////////////////
///////////////////////////

function activateFirstClick(mode) {
    if (mode) {
        o.adArea.addEventListener("click", firstClick);
    } else {
        o.adArea.removeEventListener("click", firstClick);
    }
}

function activateButtons() {
    o.adArea.addEventListener("click", ctaFunction);
}

function removeButtons() {
    o.adArea.removeEventListener("click", ctaFunction);
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

function pitagor(a, b) { return Math.pow((Math.pow(a, 2) + Math.pow(b, 2)), 0.5) }
function easeInCubic(t) { return t * t * t }

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
var kaspinasImg;
var swipe_allowed = false;

//

function initLoad() {
    prepareElements();
    loadAsset(assets.init);
}

function prepareElements() {
    // id
    var names = oNames.id.split(' ');
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        o[name] = document.getElementById(name);
    };
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

        // console.log( a[k] )

        if (a[k].type == "seq") {


            for (var z = a[k].start; z < a[k].start + a[k].amm; z++) {

                var id = a[k].names + z;
                // console.log("id", id)

                var img = new Image();
                img.myCustomData = { name: a[k].names, index: z, id: id };

                img.onload = function () {

                    var div = document.createElement("div");
                    div.style.position = "absolute";
                    div.style.width = this.width + "px";
                    div.style.height = this.height + "px";
                    div.style.backgroundImage = "url(" + this.src + ")";
                    div.style.opacity = 0;
                    div.setAttribute("id", this.myCustomData.id)
                    o.seqAll.appendChild(div);

                    o[this.myCustomData.id] = div;

                }

                img.src = assets_url + a[k].folder + "/" + id + "." + a[k].format;

            }

        } else {
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
                            TweenMax.set(el, { scale: scale, left: -this.width / 4, top: -this.height / 4, transformOrigin: '50% 50%' });
                        }
                    }

                    countAsset(this.myCustomData.a, this.myCustomData.numb, this.myCustomData.total);
                };
                img.src = assets_url + names[i] + "." + a[k].format;
            }
        }
    }
}

function countAsset(asset, o, total) {
    // console.log( "countAsset", asset[o].curLoad, total );

    asset[o].curLoad++;
    if (asset[o].curLoad == (total)) {
        // console.log("proceed", asset.cur_asset_pack, asset.asset_packs)
        asset.cur_asset_pack++;
        if (asset.cur_asset_pack == (asset.asset_packs)) {
            assetSetLoaded();
        }
    }
}

function assetSetLoaded() {
    console.log("assetSetLoaded");
    assetsCur++;
    if (assetsCur == 1) {
        init();
        loadOther();
    } else if (assetsCur == assetsTotal) {
        allLoaded = true;
    }
}

//

Object.size = function (obj) { // get objects ammount in var
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