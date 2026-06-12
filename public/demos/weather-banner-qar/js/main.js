function createRain() {
    const weatherContainer = document.getElementById("weather-banner");
    const rainImages = ["./img/rainflake.png", "./img/rainflake2.png", "./img/rainflake3.png"];

    for (let i = 0; i < 20; i++) {
        let rainflake = document.createElement("img");
        let randomImage = rainImages[Math.floor(Math.random() * rainImages.length)];
        rainflake.src = randomImage;
        rainflake.classList.add("rain-drop");

        let size = Math.random() * 10 + 10;
        let position = Math.random() * window.innerWidth;
        let duration = Math.random() * 5 + 5;
        let sway = Math.random() * 150 - 15;

        rainflake.style.left = `${position}px`;
        rainflake.style.top = `-${size}px`;
        rainflake.style.width = `${size}px`;
        rainflake.style.height = `${size}px`;
        rainflake.style.animationDuration = `${duration}s`;
        rainflake.style.setProperty("--sway", `${sway}px`);

        weatherContainer.appendChild(rainflake);

        setTimeout(() => {
            rainflake.remove();
        }, duration * 500);
    }
}

function createSnowflakes() {
    const weatherContainer = document.getElementById("weather-banner");

    for (let i = 0; i < 30; i++) {
        let snowflake = document.createElement("img");
        snowflake.src = "./img/snowflake.png";
        snowflake.classList.add("snowflake");

        let size = Math.random() * 10 + 10;
        let position = Math.random() * window.innerWidth;
        let duration = Math.random() * 5 + 5;
        let sway = Math.random() * 30 - 15;


        snowflake.style.left = `${position}px`;
        snowflake.style.top = `-${size}px`;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.setProperty("--sway", `${sway}px`);

        weatherContainer.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const weatherContainer = document.getElementById("weather-banner");
    const weathertext = document.getElementsByClassName("banner_text")[0];
    try {
        const response = await fetch("https://api2.adsgarden.com/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "get_weather",
                parameters: {
                    q: "baku"
                }
            })
        });

        const data = await response.json();
        // const weather = data.data.description;
        const weather = "qar"
        updateWeatherUI(weather);
    } catch (error) {
        console.error("Xəta baş verdi:", error);
        weathertext.innerHTML = "Hava durumu bilgisi alınamadı.";
    }
});

function updateWeatherUI(weather) {
    const weatherContainer = document.getElementById("weather-banner");
    const weathertext = document.getElementsByClassName("banner_text")[0];
    const weatherIcon = document.getElementsByClassName("icon_img")[0];
    const cloudOne = document.getElementsByClassName("cloud_first")[0];
    const cloudTwo = document.getElementsByClassName("cloud_second")[0];
    const bannerBackground = document.getElementsByClassName("banner_bg")[0];
    const bannerBackgrounddiv = document.getElementsByClassName("background_img")[0];
    const sunImg = document.getElementsByClassName("sun_img")[0];

    weathertext.innerHTML = "";

    let weatherWords = weather.split(" ");
    let mainWeather = weatherWords.length > 1 ? weatherWords[1].toLowerCase() : weatherWords[0].toLowerCase();

    if (weather.toLowerCase().includes("qapalı buludlu")) {
        mainWeather = "yağış";
    }

    let animation;
    switch (mainWeather) {
        case "buludlu":
            animation = "Buludlar nə qədər sıx olsa da, Mood Bites ləzzəti ilə gününüz işıqlansın!";
            weatherContainer.style.background = "linear-gradient(180deg, #A5C5F2 0%, #DBE8FA 100%)";
            src = "./img/cloud_icon.svg"
            bannerBgSrc = "./img/bg_img.png"
            break;
        case "səma":
            animation = "Günəş saçanda, Mood Bites hər loxmada yay əhval-ruhiyyəsini gətirir!";
            weatherContainer.style.background = "linear-gradient(180deg, #D9CBA6 0%, #FFECCA 100%)";
            src = "./img/sun.svg"
            bannerBgSrc = "./img/bg_img.png"
            sunSrc = "./img/sun_rotate.png"
            sunImg.src = sunSrc
            cloudTwo.innerHTML = ""
            cloudOne.innerHTML = ""
            break;
        case "yağış":
            animation = "Buludlar nə qədər sıx olsa da, Mood Bites ləzzəti ilə gününüz işıqlansın!";
            weatherContainer.style.background = "linear-gradient(180deg, #A5C5F2 0%, #DBE8FA 100%)";
            src = "./img/rain_cloud.svg"
            bannerBgSrc = "./img/bg_img.png"
            bannerBackgrounddiv.style.mixBlendMode = "normal"
            bannerBackgrounddiv.style.opacity = "0.32"
            cloudOne.style.opacity = "0.32"
            cloudTwo.style.opacity = "0.32"
            setInterval(createRain, 100);
            break;
        case "qar":
            animation = "Hava soyuq, ürəklər isti: Mood Bites hər loxmada sizi isindirəcək!";
            weatherContainer.style.background = "linear-gradient(180deg, #416FAF 0%, #AEBACB 100%)";
            src = "./img/snow_cloud.png"
            bannerBgSrc = "./img/bg_snow.png"
            setInterval(createSnowflakes, 500);
            cloudTwo.innerHTML = ""
            cloudOne.innerHTML = ""
            break;
        default:
            animation = "🌍 Bilinmeyen Hava";
            weatherContainer.style.background = "white";
    }

    weatherIcon.src = src
    bannerBackground.src = bannerBgSrc
    weathertext.innerHTML = animation;
}