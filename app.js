;(function(window, document) {
let weatherArr = [];
let weatherSection = document.querySelector('.weather');
function WeatherObj(temperature, summary, icon, iconIndex){
    this.temperature = temperature;
    this.summary = summary;
    this.icon = icon;
    this.iconIndex = iconIndex;
}
function TemperatureObj(temperatureF, temperatureC){
    this.temperatureF = temperatureF;
    this.temperatureC = temperatureC;
}

//начало работы
window.addEventListener('load', () =>  {
    navigator.geolocation.getCurrentPosition(async (pos) => {
            const weatherApiData = await getWeatherApiData(pos.coords.longitude, pos.coords.latitude);
            weatherArr = handleApiData(weatherApiData);
            switchRender();
    },() => h2.textContent = 'unlock your location');
});
document.querySelector('.selectric').addEventListener('change', () => {
    changeActiveNav (document.querySelector('.menu li.active'), (data) => switchRender(data));
});
Array.from(document.querySelectorAll('.menu li')).forEach(el => {
    el.addEventListener('click', () => {
        const dataActiveDay = document.querySelector('[data-day].active');
        dataActiveDay.classList.remove('active');
        el.classList.add('active');
        changeActiveNav (el,  (data) => switchRender(data));
    })
});
//отправляем запрос на данные
async function getWeatherApiData(long, lat){
    const proxy = "https://cors-anywhere.herokuapp.com/"; // чтобы локально достучаться
    let url = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
    const response = await fetch(`${proxy}${url}`);
    return await response.json();
}
//обрабатываем данные под себя
function handleApiData(data){
    const weatherArr = [];
    const {temperature, summary, icon} = data.currently;
    const tempDegreeC = Math.floor( (+temperature - 32) * (5 / 9));
    weatherArr.push(new WeatherObj(new TemperatureObj(temperature, tempDegreeC), summary, icon, 'icon01'));
    data.daily.data.slice(1).forEach((el, index) => {
        const {temperatureMax, temperatureMin, summary, icon} = el;
        const temperature = Math.floor((temperatureMax + temperatureMin) / 2);
        const tempDegreeC = Math.floor( (+temperature - 32) * (5 / 9) );
        weatherArr.push(new WeatherObj(new TemperatureObj(temperature, tempDegreeC), summary, icon, `icon${++index}`));
    });
    return weatherArr;
}
function switchRender(day) {
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

// html структура блока
function renderWeather(e){
    const degree =  document.querySelector('.selectric').value;
    let temperature;
    let degreeN;
    if (degree === '˚C, m/s'){
        temperature = e.temperature.temperatureC;
        degreeN= '˚C, m/s';
    }else{
        temperature = e.temperature.temperatureF;
        degreeN= '˚F, mph';
    }
    let source = document.getElementById("template").innerHTML;
    let template = Handlebars.compile(source);
    let updates = document.getElementById("weather");
    updates.insertAdjacentHTML('beforeend',  template({iconIndex: e.iconIndex,temperature: temperature, summary: e.summary, degree: degreeN}));
    setIcons(e.icon, e.iconIndex);
}

//выводим иконку через skycons
function setIcons(icon, iconIndex) {
    const skycons = new Skycons({"color": "pink"});
    const CurrentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconIndex, Skycons[CurrentIcon]);
}


//подсветка меню
function changeActiveNav (nav, callBackFun){
    document.querySelector('.menu li.active').classList.remove('active');
    nav.classList.add('active');
    const dataSet = document.querySelector('.menu li.active').dataset.day;
    callBackFun(dataSet);
}
})(window, document);