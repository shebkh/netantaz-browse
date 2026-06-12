async function loadFonts_27() {

    return new Promise((resolve, reject) => {

        settings.assets.forEach((el) => {

            if (el.type === 'font') {

                const font = new FontFace(el.fontName, `url(${assets_url + el.src}.${el.format})`);

                font.load().then(() => {

                    document.fonts.add(font);

                    return resolve(font);
                });
            }
        });
    });
}

async function loadImages_27() {

    return new Promise((resolve, reject) => {

        var cnt = 0;
        var length = 0;

        settings.assets.forEach((el) => {

            if (el.format === 'png' || el.format === 'jpg' && el.src !== '') {

                var spl = el.src.split(' ');
                var form = el.format;
                var fix = el.type;

                length += spl.length;

                spl.forEach((el) => {

                    var img = new Image();
                    // var img = document.createElement('img');
                    var obj;

                    cnt++;

                    if (fix === 'class' && el !== '') {

                        obj = document.querySelector(`.${el}`);
                    }
                    else if (el !== '') {

                        obj = document.getElementById(`${el}`);
                    }

                    if (obj) {

                        obj.style.backgroundImage = `url(${assets_url + el}.${form})`;

                        img.src = `${assets_url + el}.${form}`;
                        img.dataset.att = el;
                        // img.crossOrigin = 'anonymous';
                        // img.removeAttribute('loading');

                        img.addEventListener('load', (e) => {

                            // if(fix === 'class'){

                            //     obj = document.querySelector(`.${e.target.dataset.att}_${settings.uniq_id}`);
                            // }
                            // else{

                            //     obj = document.getElementById(`${e.target.dataset.att}_${settings.uniq_id}`);
                            // }

                            // obj.style.backgroundImage = `url(${e.target.src})`;

                            img = null;

                            if (cnt == length) {

                                return resolve();
                            }
                        });

                    }

                })
            }
        });
    });
}

var divs_27 = document.getElementsByTagName('div');
var canvases_27 = document.getElementsByTagName('canvas');
var inputs_27 = document.getElementsByTagName('input');
var svgs_27 = document.getElementsByTagName('svg');

var obs = [divs_27, canvases_27, inputs_27, svgs_27];

function setOb_27(node, nr) {

    var cln = '';
    var idn = '';

    var d = node[nr];

    var nms;

    if (d.hasAttribute('class')) {

        cln = d.className;

        if (d.tagName === 'svg') {

            cln = cln.baseVal;
        }

        nms = cln.split(' ');
    }

    if (d.hasAttribute('id')) {

        idn = d.id;
    }

    if (idn !== '') {

        o[idn] = d;

        return;
    }

    if (cln !== '') {

        o[nms[0]] = d;
    }
}


async function setObjects_27() {

    return new Promise((resolve, reject) => {

        obs.forEach((el) => {

            for (var i = 0; i < el.length; i++) {

                setOb_27(el, i);
            }
        });

        return resolve();
    });
}


loadImages_27().then(() => {

    loadFonts_27().then(() => {

        setObjects_27().then(() => {

            document.dispatchEvent(new CustomEvent('ad27oaded', { detail: {} }));
        });

    });
});