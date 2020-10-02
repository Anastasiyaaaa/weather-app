;(function(window, document) {
    let long;
    let lat;
    let weatherArr;
    let weatherSection = document.querySelector('.weather');

    function WeatherObj(temperature, degree, summary, icon, iconIndex) {
        this.temperature = {temperature, degree};
        this.summary = summary;
        this.icon = icon;
        this.iconIndex = iconIndex;
    }

//начало работы
    window.addEventListener('load', () => {
        checkGeolocation();
    });

//проверка включена ли геолокация
    function checkGeolocation() {
        navigator.geolocation ? getCoords() : h1.textContent = 'unlock your location';
    }

//получаем текущие координаты
    function getCoords() {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            getWeatherAPI(long, lat);
        })
    }

//отправляем запрос на данные
async function getWeatherAPI(long, lat) {
    const proxy = "https://cors-anywhere.herokuapp.com/"; // чтобы локально достучаться
    let url = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
    const response = await fetch(`${proxy}${url}`);
    const data = await response.json();
    handleWeatherArr(data);
}

//обрабатываем данные под себя
    function handleWeatherArr(data) {
        weatherArr = [];
        const {temperature, summary, icon} = data.currently;
        const tempDegreeC = Math.floor((+temperature - 32) * (5 / 9));
        const selectricLabel = document.querySelector('.selectric-label');
        if (selectricLabel.textContent === "˚C, m/s") {
            weatherArr.push(new WeatherObj(tempDegreeC, "˚C, m/s", summary, icon, 'icon01'));
        } else if (selectricLabel.textContent === '˚F, mph') {
            weatherArr.push(new WeatherObj(temperature, '˚F, mph', summary, icon, 'icon02'));
        }
        data.daily.data.slice(1).forEach((el, index) => {
            const {temperatureMax, temperatureMin, summary, icon} = el;
            const temperature = Math.floor((temperatureMax + temperatureMin) / 2);
            const tempDegreeC = Math.floor((+temperature - 32) * (5 / 9));
            if (selectricLabel.textContent === "˚C, m/s") {
                weatherArr.push(new WeatherObj(tempDegreeC, '˚C, m/s', summary, icon, `icon${++index}`));
            } else if (selectricLabel.textContent === '˚F, mph') {
                weatherArr.push(new WeatherObj(temperature, '˚F, mph', summary, icon, `icon${++index}`));
            }
        });
        checkDataDay(document.querySelector('.menu li.active').dataset.day);
    }

// html структура блока
    function renderWeather(e) {
        let source = document.getElementById("template").innerHTML;
        let template = Handlebars.compile(source);
        let updates = document.getElementById("weather");
        updates.insertAdjacentHTML('beforeend',  template(e));
        setIcons(e.icon, e.iconIndex);
    }
//выводим иконку через skycons
    function setIcons(icon, iconIndex) {
        const skycons = new Skycons({"color": "pink"});
        const CurrentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconIndex, Skycons[CurrentIcon]);
    }

//клик по выборы температуры




//клик по меню
    function checkDataDay(day) {
        // changeActiveNav(nav);
        switch (day) {
            case 'tomorrow':
                weatherSection.innerHTML = "";
                renderWeather(weatherArr[1]);
                break;
            case "threeDays":
                weatherSection.innerHTML = "";
                for (let i = 1; i <= 3; i++) {
                    renderWeather(weatherArr[i])
                }
                break;
            case 'week':
                weatherSection.innerHTML = "";
                for (let i = 1; i <= 7; i++) {
                    renderWeather(weatherArr[i])
                }
                break;
            default:
                weatherSection.innerHTML = "";
                renderWeather(weatherArr[0]);
        }
    }
    //change days to show
    Array.from(document.querySelectorAll('.menu li')).forEach(el => {
        el.addEventListener('click', () => {
            const dataActiveDay = document.querySelector('[data-day].active');
            dataActiveDay.classList.remove('active');
            el.classList.add('active');
            const newData = el.dataset.day;
            checkDataDay(newData);
        })
    });

    document.querySelector('.selectric-button').addEventListener('click', () => {
        document.querySelector('.selectric-items-wrapper').style.display = 'block';
    });
    Array.from(document.querySelectorAll('.selectric-items li')).forEach(el => {
        el.addEventListener('click', () => {
            console.log(el.textContent);
            document.querySelector('.selectric-label').textContent = el.textContent;
            document.querySelector('.selectric-items-wrapper').removeAttribute("style");
            getWeatherAPI(long, lat);
        });
    });

})(window, document);