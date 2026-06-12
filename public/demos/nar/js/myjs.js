
// close-catfish-start
const close_catfish=document.querySelector("#close_catfish");
close_catfish.addEventListener("click",function (){
    document.querySelector(".wrapper").style="display:none";
});


// close-catfish-end






// Params
var sliderSelector = '.swiper-container',
    options = {
        init: false,
        loop: true,
        allowTouchMove: false,
        speed: 800,
        spaceBetween: 0,
        autoplay: {
            slideSpeed: 800,
            delay: 1000,
            disableOnInteraction: false,
        },
        slidesPerView: 5, // or 'auto'
        // spaceBetween: 10,
        centeredSlides: true,
        effect: 'coverflow', // 'cube', 'fade', 'coverflow',
        coverflowEffect: {
            rotate: 0, // Slide rotate in degrees
            stretch: 0, // Stretch space between slides (in px)
            depth: 500, // Depth offset in px (slides translate in Z axis)
            modifier: 2, // Effect multipler
            slideShadows: false, // Enables slides shadows
        },
        grabCursor: true,
        parallax: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Events
        on: {
            imagesReady: function() {
                this.el.classList.remove('loading');
            },
            slideChange: function() {
                // console.log("dgsdgkdfgd")
                $(".swiper-slide.swiper-slide-active").each(function() {
                    var this_val = $(this).find(".caption_sld").val();
                    $("#capVal").val(this_val);
                    $(".cat_reslut_inner").html(this_val);

                    var this_val_new = $(this).find(".caption_sld_2").val();
                    $("#capVal2").val(this_val);
                    $(".cat_reslut_inner_2").html(this_val_new);

                });

            }
        }
    };
var mySwiper = new Swiper(sliderSelector, options);
// Initialize slider
mySwiper.init();