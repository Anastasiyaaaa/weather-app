
// let weatherArr;
let weatherSection = document.querySelector('.weather');
// let coords = {};

function WeatherObj(temperature, degree, summary, icon, iconIndex){
    this.temperature = {temperature, degree};
    this.summary = summary;
    this.icon = icon;
    this.iconIndex = iconIndex;
}

//начало работы
window.addEventListener('load', async () =>  {
    if ( navigator.geolocation) {
        completeFunctions()
    } else {
        h1.textContent = 'unlock your location';
    }
});
async function completeFunctions(day) {
    const coords = await getCoords();
    const weatherAPI = await getWeatherAPI(coords.long, coords.lat);
    const weatherArr =  handleWeatherArr(weatherAPI);
    switchRender(day, weatherArr);
}

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
async function getWeatherAPI(long, lat){
    const proxy = "https://cors-anywhere.herokuapp.com/"; // чтобы локально достучаться
    let url = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
    const response = await fetch(`${proxy}${url}`);
    return await response.json();
}
//обрабатываем данные под себя
function handleWeatherArr(data){
    const weatherArr = [];
    const {temperature, summary, icon} = data.currently;
    const tempDegreeC = Math.floor( (+temperature - 32) * (5 / 9));
    const selectricLabel = document.querySelector('.selectric-label');
    if (selectricLabel.textContent === "˚C, m/s") {
        weatherArr.push(new WeatherObj(tempDegreeC, "˚C, m/s", summary, icon, 'icon01'));
    } else if(selectricLabel.textContent === '˚F, mph') {
        weatherArr.push(new WeatherObj(temperature, '˚F, mph', summary, icon, 'icon02'));
    }
    data.daily.data.slice(1).forEach((el, index) => {
        const {temperatureMax, temperatureMin, summary, icon} = el;
        const temperature = Math.floor((temperatureMax + temperatureMin) / 2);
        const tempDegreeC = Math.floor( (+temperature - 32) * (5 / 9) );
        if (selectricLabel.textContent === "˚C, m/s") {
            weatherArr.push(new WeatherObj(tempDegreeC, '˚C, m/s', summary, icon, `icon${++index}`));
        } else if(selectricLabel.textContent === '˚F, mph') {
            weatherArr.push(new WeatherObj(temperature, '˚F, mph', summary, icon, `icon${++index}`));
        }
    });
    return weatherArr;
}
function switchRender(day,weatherArr ) {
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
    const weatherTemplate = document.createElement('div');
    weatherTemplate.className = "weather-block";
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '128');
    canvas.setAttribute('height', '128');
    canvas.id = e;
    const degreeWrapper = document.createElement('div');
    const weatherDegreeNum = document.createElement('span');
    weatherDegreeNum.className = "weather-degree_num";
    const weatherDegree = document.createElement('span');
    weatherDegree.className = "weather-degree";
    degreeWrapper.append(weatherDegreeNum, weatherDegree);
    const weatherSummary = document.createElement('div');
    weatherSummary.className = "weather-description";
    weatherTemplate.append(canvas, degreeWrapper,weatherSummary );
    canvas.id = e.iconIndex;
    weatherDegreeNum.textContent = e.temperature.temperature;
    weatherDegree.textContent = e.temperature.degree;
    weatherSummary.textContent = e.summary;
    weatherSection.insertAdjacentHTML('beforeend', weatherTemplate.outerHTML);
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
function showDegreesVariants(){
    const selectricItemsWrapper = document.querySelector('.selectric-items-wrapper');
    selectricItemsWrapper.style.display = 'block';
}
//выбор градусов
async function chooseDegrees(degree){
    const selectricLabel = document.querySelector('.selectric-label');
    const selectricItemsWrapper = document.querySelector('.selectric-items-wrapper');
    selectricItemsWrapper.removeAttribute("style");
    selectricLabel.textContent = degree.textContent;
    checkDataDay(document.querySelector('.menu li.active'),
        document.querySelector('.menu li.active').dataset.day);
}
//клик по меню
function checkDataDay(nav, day){
    changeActiveNav (nav);
    completeFunctions(day);
}
//подсветка меню
function changeActiveNav (nav){
    document.querySelector('.menu li.active').classList.remove('active');
    nav.classList.add('active');
}
