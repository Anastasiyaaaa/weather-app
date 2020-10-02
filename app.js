;(function(window, document) {
let weatherArr = [];
let weatherSection = document.querySelector('.weather');
// let coords = {};

function WeatherObj(temperature, summary, icon, iconIndex){
    this.temperature = temperature;
    this.summary = summary;
    this.icon = icon;
    this.iconIndex = iconIndex;
}
function TmperatureObj(temperatureF, temperatureC){
    this.temperatureF = temperatureF;
    this.temperatureC = temperatureC;
}

//начало работы
window.addEventListener('load', async () =>  {
    if ( navigator.geolocation) {
        const coords = await getCoords();
        const weatherApiData = await getWeatherApiData(coords.long, coords.lat);
        weatherArr =  handleApiData(weatherApiData);
        switchRender();
    } else {
        h1.textContent = 'unlock your location';
    }
});

//получаем текущие координаты
function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}
async function getCoords() {
    let position = await getPosition();  // wait for getPosition to complete
    const coords = await {lat: position.coords.latitude, long: position.coords.longitude};
    // console.log({lat: position.coords.latitude, long: position.coords.longitude})
   return (coords)
}
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
    weatherArr.push(new WeatherObj(new TmperatureObj(temperature, tempDegreeC), summary, icon, 'icon01'));
    data.daily.data.slice(1).forEach((el, index) => {
        const {temperatureMax, temperatureMin, summary, icon} = el;
        const temperature = Math.floor((temperatureMax + temperatureMin) / 2);
        const tempDegreeC = Math.floor( (+temperature - 32) * (5 / 9) );
        weatherArr.push(new WeatherObj(new TmperatureObj(temperature, tempDegreeC), summary, icon, `icon${++index}`));
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
   // todo переписать по мотивам ветки 01-10 что бы выводили когда нужно Ц или Ф градусы
function renderWeather(e){
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

document.querySelector('.selectric').addEventListener('change', () => {
    checkDataDay(document.querySelector('.menu li.active'),
        document.querySelector('.menu li.active').dataset.day);
});
    Array.from(document.querySelectorAll('.menu li')).forEach(el => {
        el.addEventListener('click', () => {
            const dataActiveDay = document.querySelector('[data-day].active');
            dataActiveDay.classList.remove('active');
            el.classList.add('active');
            const newData = el.dataset.day;
            checkDataDay(el, newData);
        })
    });
//клик по меню
function checkDataDay(nav, day){
    changeActiveNav (nav);
    switchRender(day);
}
//подсветка меню
function changeActiveNav (nav){
    document.querySelector('.menu li.active').classList.remove('active');
    nav.classList.add('active');
}
})(window, document);