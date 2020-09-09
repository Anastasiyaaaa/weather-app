let todayTemplate = '<div class="location"><h1 class="location-timezone v2">Timezone</h1><canvas id="icon" width="128" height="128">Icon</canvas></div><div class="temperature temperature-section"><div class="degree-section"><h2 class="temperature-degree"></h2><span>˚F, mph</span></div><div class="temperature-description">Comfortable weather</div></div>';
let threeDaysTemplate = '<div class="temperature temperature-section" data-block><div class="location"><canvas id="icon" class="icon" width="128" height="128">Icon</canvas></div> <div class="degree-section"><h2 class="temperature-degree"></h2></div> <div class="temperature-description">Comfortable weather</div></div>'
let threeDaysTemplate2 = '<div class="temperature temperature-section"><div class="location"><canvas id="icon" class="icon" width="128" height="128">Icon</canvas></div> <div class="degree-section"><h2 class="temperature-degree"></h2></div> <div class="temperature-description">Comfortable weather</div></div>'

let main = document.querySelector('#main');

function showContent(data) {
    switch (data.dataset.day) {
        case 'today':
            main.innerHTML = todayTemplate;
            break;
        case 'tomorrow':
            main.innerHTML = todayTemplate;
            break;
        case "threeDays":
            main.innerHTML = "";
            break;
        case 'week':
            main.innerHTML = "";
            break;
    }
    setTimeout(() => navigation(), 2000);
}



// showContent(dataActiveDay);


function navigation() {
    let long;
    let lat;
    let newDegree;
    let temperatureDegree = document.querySelector('.temperature-degree');
    let temperatureDesc = document.querySelector('.temperature-description');
    let lacationTimeZone = document.querySelector('.location-timezone');
    let iconId = document.querySelector('#icon');
    // let iconS =
    let temperatureSection = document.querySelector('.temperature-section');
    let temperatureSpan = document.querySelector('.temperature-section span');
    let selectric = document.querySelector('.selectric-button');
    let selectricLabel = document.querySelector('.selectric-label');
    let selectricItemsWrapper = document.querySelector('.selectric-items-wrapper');
    let selectricItems = document.querySelectorAll('.selectric-items li');
    let menu = Array.from(document.querySelectorAll('.menu li'));
    let dataActiveDay = document.querySelector('[data-day].active');


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const proxy = "https://cors-anywhere.herokuapp.com/"; // чтобы локально достучаться

            let url = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;


            function setContentMoreeDays(data, days) {
                let threeDaysArr = data.daily.data.slice(0,days);
                threeDaysArr.forEach(el => {
                    let {summary, icon, temperatureHigh} = el;
                    main.insertAdjacentHTML("beforeEnd" , threeDaysTemplate);
                    // temperatureSection.dataset.block = `${i}`;
                    // let temperatureSection = document.querySelector('.temperature-section');
                    // let temperatureDegree2 = temperatureSectionS[i].querySelector('.temperature-degree');
                    // let temperatureDesc2 = document.querySelector('.temperature-description');
                    console.log(summary, icon, temperatureHigh);
                    // temperatureDegree2.textContent = temperatureHigh;
                    // temperatureDesc2.textContent = summary;
                    // setIcons(icon, iconId);
                });
                let temperatureSectionS = Array.from(document.querySelectorAll('.temperature-section'));
                console.log(temperatureSectionS);
                for (let i = 0; i < temperatureSectionS.length; i++){
                    temperatureSectionS[i].dataset.block = `${i}`;
                    console.log(threeDaysArr[i]);
                    let {summary, icon, temperatureHigh} = threeDaysArr[i];

                    let temperatureDegree = temperatureSectionS[i].querySelector('.temperature-degree');
                    let temperatureDesc = temperatureSectionS[i].querySelector('.temperature-description');

                    temperatureDegree.textContent = temperatureHigh;
                    temperatureDesc.textContent = summary;
                }
            }
            function setTextContent(data){
                // let summary, icon, temperature;
                if (dataActiveDay.dataset.day === 'tomorrow') {
                    var {summary, icon} = data.daily;
                    var temperature = data.daily.data[0].temperatureHigh
                }else if (dataActiveDay.dataset.day === 'today'){
                    var {summary, icon, temperature} = data.currently;
                }
                //Set DOM Elements from the API
                temperatureDegree.textContent = temperature;
                temperatureDesc.textContent = summary;
                lacationTimeZone.textContent = data.timezone;
                //Set Icon
                setIcons(icon, iconId);
                console.log(temperature - 20);                newDegree = (temperature - 32) * (5 / 9);
            }

            async function getWeatherAPI() {
                const response = await fetch(`${proxy}${url}`);
                const data = await response.json();
                (dataActiveDay.dataset.day === 'threeDays' || dataActiveDay.dataset.day === 'week') ?  setContentMoreeDays(data,  dataActiveDay.dataset.quantity) : setTextContent(data);

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
                        changeActiveEl(dataActiveDay, el);
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