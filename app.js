let today = '<div class="location"><h1 class="location-timezone v2">Timezone</h1><canvas id="icon" width="128" height="128">Icon</canvas></div><div class="temperature temperature-section"><div class="degree-section"><h2 class="temperature-degree"></h2><span>˚F, mph</span></div><div class="temperature-description">Comfortable weather</div></div>';
let main = document.querySelector('#main');

function showContent(data) {
    switch (data.dataset.days) {
        case 'today':
            main.innerHTML = today;
            break;
        case 'tomorrow':
            main.innerHTML = today;
            break;
        case "10 days":
            main.innerHTML = today;
            break;
        case 'month':
            main.innerHTML = today;
            break;
        default:
            main.innerHTML = today;
    }
    setTimeout(() => navigation(), 2000);
}



// showContent(dataDay);


function navigation() {
    let long;
    let lat;
    let temperatureDegree = document.querySelector('.temperature-degree');
    let temperatureDesc = document.querySelector('.temperature-description');
    let lacationTimeZone = document.querySelector('.location-timezone');
    let iconId = document.querySelector('#icon');
    let temperatureSection = document.querySelector('.temperature-section');
    let temperatureSpan = document.querySelector('.temperature-section span');
    let selectric = document.querySelector('.selectric-button');
    let selectricLabel = document.querySelector('.selectric-label');
    let selectricItemsWrapper = document.querySelector('.selectric-items-wrapper');
    let selectricItems = document.querySelectorAll('.selectric-items li');
    let menu = Array.from(document.querySelectorAll('.menu li'));
    let dataDay = document.querySelector('[data-day].active');

    console.log('ggggg');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const proxy = "https://cors-anywhere.herokuapp.com/"; // чтобы локально достучаться

            let url = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;

            async function getWeatherAPI() {
                const response = await fetch(`${proxy}${url}`);
                const data = await response.json();
                console.log(url);
                const {temperature, summary, icon} = data.currently;

                //Set DOM Elements from the API
                temperatureDegree.textContent = temperature;
                temperatureDesc.textContent = summary;
                lacationTimeZone.textContent = data.timezone;
                console.log(data.timezone);
                //Set Icon
                setIcons(icon, iconId);
                console.log(typeof temperature);
                console.log(temperature - 20);
                let newDegree = (temperature - 32) * (5 / 9);

                //chancge temperature to  C/F
                selectric.addEventListener('click', () => {
                    selectricItemsWrapper.style.display = 'block';
                });
                selectricItems.forEach(el => {
                    el.addEventListener('click', () => {
                        console.log(el.textContent);
                        selectricLabel.textContent = el.textContent;
                        temperatureSpan.textContent = el.textContent;
                        selectricItemsWrapper.removeAttribute("style");
                        if (el.dataset.index === "0") {
                            temperatureDegree.textContent = temperature;
                        } else {
                            temperatureDegree.textContent = Math.floor(newDegree);
                        }
                    });
                });

                //change days to show
                menu.forEach(el => {
                    el.addEventListener('click', () => {
                        changeActiveEl(dataDay, el);
                    })
                });

                function changeActiveEl(active, ChangeToActive) {
                    active.classList.remove('active');
                    ChangeToActive.classList.add('active');
                    let newData = document.querySelector('[data-day].active');
                    showContent(newData);
                }

                // temperatureSection.addEventListener('click', () => {
                //    if (temperatureSpan.textContent === "F") {
                //         temperatureSpan.textContent = "C";
                //        temperatureDegree.textContent = Math.floor(newDegree) ;
                //    } else   {
                //        temperatureSpan.textContent = "F";
                //        temperatureDegree.textContent = temperature;
                //    }
                // })
            }

            getWeatherAPI();

        });

    } else {
        h1.textContent = 'unlock your location'
    }

    function setIcons(icon, iconID) {
        const skycons = new Skycons({"color": "pink"});
        const CurrentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        console.log(CurrentIcon);
        return skycons.set(iconID, Skycons[CurrentIcon]);
    }
}
window.addEventListener('load', () => {

    navigation();

});