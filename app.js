let long;
let lat;
let weatherArr = [];
function WeatherObj(temperature, degree, summary, icon, iconIndex){
    this.temperature = {temperature, degree};
    // this.temperatureC = {temperature: temperatureC, degree: '˚C, m/s'};
    this.summary = summary;
    this.icon = icon;
    this.iconIndex = iconIndex;
}
let weatherSection = document.querySelector('.weather');
let canvas, degreeWrapper, weatherDegreeNum, weatherDegree,weatherSummary;
let weatherTemplate1;

window.addEventListener('load', () => {
    // weatherTemplate1 = createWeatherBlock();


    checkGeolocation();




    renderWeather
});
function checkGeolocation(){
    navigator.geolocation ? getCoords() : h1.textContent = 'unlock your location';
}
function getCoords(){
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        getWeatherAPI(long, lat, (data) => handleWeatherArr(data));

    })
}
async function getWeatherAPI(long, lat, callbackFunction){
    const proxy = "https://cors-anywhere.herokuapp.com/"; // чтобы локально достучаться
    let url = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
    const response = await fetch(`${proxy}${url}`);
    const data = await response.json();
    callbackFunction(data);
}
function handleWeatherArr(data){
    const {temperature, summary, icon} = data.currently;
    const tempDegreeC = Math.floor( (+temperature - 32) * (5 / 9));
    if ("rrr") {
        weatherArr.push(new WeatherObj(tempDegreeC, '˚C, m/s', summary, icon, 'icon0'));
    } else {
        weatherArr.push(new WeatherObj(temperature, '˚F, mph', summary, icon, 'icon0'));
    }

    data.daily.data.slice(1).forEach((el, index) => {
        const {temperatureMax, temperatureMin, summary, icon} = el;
        const temperature = Math.floor((temperatureMax + temperatureMin) / 2);
        const tempDegreeC = Math.floor( (+temperature - 32) * (5 / 9) );
        if ("rrr") {
            weatherArr.push(new WeatherObj(tempDegreeC, '˚C, m/s', summary, icon, `icon${++index}`));
        } else {
            weatherArr.push(new WeatherObj(temperature, '˚F, mph', summary, icon, `icon${++index}`));
        }
    });
    renderWeather(weatherArr);
}
// function createWeatherBlock() {
//     const weatherTemplate = document.createElement('div');
//     weatherTemplate.className = "weather-block";
//     canvas = document.createElement('canvas');
//     canvas.setAttribute('width', '128');
//     canvas.setAttribute('height', '128');
//     degreeWrapper = document.createElement('div');
//     weatherDegreeNum = document.createElement('span');
//     weatherDegreeNum.className = "weather-degree_num";
//     weatherDegree = document.createElement('span');
//     weatherDegree.className = "weather-degree";
//     degreeWrapper.append(weatherDegreeNum, weatherDegree);
//     weatherSummary = document.createElement('div');
//     weatherSummary.className = "weather-description";
//     weatherTemplate.append(canvas, degreeWrapper,weatherSummary );
//     return weatherTemplate;
// }
function renderWeather(e){
    console.log(e);
    const weatherTemplate = document.createElement('div');
    weatherTemplate.className = "weather-block";
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '128');
    canvas.setAttribute('height', '128');
    canvas.id = e;
        degreeWrapper = document.createElement('div');
    weatherDegreeNum = document.createElement('span');
    weatherDegreeNum.className = "weather-degree_num";
    weatherDegree = document.createElement('span');
    weatherDegree.className = "weather-degree";
    degreeWrapper.append(weatherDegreeNum, weatherDegree);
    weatherSummary = document.createElement('div');
    weatherSummary.className = "weather-description";
    weatherTemplate.append(canvas, degreeWrapper,weatherSummary );

    weatherSection.insertAdjacentHTML('beforeend', weatherTemplate.outerHTML);
    // setIcons(e.icon, e.iconIndex);

    // console.log(weatherArr);
    // weatherArr.slice(since, to).forEach((e) => {
    //     canvas.id = e.iconIndex;
    //     weatherDegreeNum.textContent = e.temperatureK.temperature;
    //     weatherDegree.textContent = e.temperatureK.degree;
    //     weatherSummary.textContent = e.summary;
    //     weatherSection.insertAdjacentHTML('beforeend', weatherTemplate.outerHTML);
    //     setIcons(e.icon, e.iconIndex);
    // });
}

function setIcons(icon, iconIndex) {
    const skycons = new Skycons({"color": "pink"});
    const CurrentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconIndex, Skycons[CurrentIcon]);
}

// выбор температуры в чём показывать
let selectric = document.querySelector('.selectric-button');
let selectricLabel = document.querySelector('.selectric-label');

let selectricItemsWrapper = document.querySelector('.selectric-items-wrapper');
let selectricItemsData = document.querySelectorAll('.selectric-items li');
//клик по выборы температуры
function showDegreesVariants(){
    selectricItemsWrapper.style.display = 'block';
}
//ыбор градусов
function chooseDegrees(degree){
    selectricItemsWrapper.removeAttribute("style");
    // weatherDegreeSpan.textContent = e.textContent;
    console.log(degree.dataset.index);
    selectricLabel.textContent = degree.textContent;
}