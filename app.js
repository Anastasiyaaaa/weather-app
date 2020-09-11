let long;
let lat;


let navElemS = Array.from(document.querySelectorAll('.menu li'));
//беру элеменьты из DOM
let weatherSection = document.querySelector('.weather');
let iconElem = document.getElementById('icon');
let weatherDegreeNum= document.querySelector('.weather-degree_num');
// let weatherDegreeSpan = document.querySelector('.weather-degree span');
let weatherDescription = document.querySelector('.weather-description');
    // выбор температуры в чём показывать
let selectric = document.querySelector('.selectric-button');
let selectricLabel = document.querySelector('.selectric-label');
// weatherDegreeSpan.textContent = selectricLabel.textContent;
let selectricItemsWrapper = document.querySelector('.selectric-items-wrapper');
let selectricItems = document.querySelectorAll('.selectric-items li');


// создаю элементы
let createWeatherBlock = document.createElement('div');
createWeatherBlock.className = "weather-block";
let canvas = document.createElement('canvas');
canvas.id = "icon";
canvas.setAttribute('width', '128');
canvas.setAttribute('height', '128');
let createWeatherDegreeWrapper = document.createElement('div');
let spanWeatherDegree = document.createElement('span');
createWeatherDegree.className = "weather-degree";
let spanWeatherDegreeNum = document.createElement('span');
spanWeatherDegreeNum.className = "weather-degree_num";
createWeatherDegreeWrapper.append(spanWeatherDegree);
let createWeatherDescription = document.createElement('div');
createWeatherDescription.className = "weather-description";
createWeatherBlock.append(canvas, createWeatherDegree,createWeatherDescription );


//клик по выборы температуры
function showDegreesVariants(){
    selectricItemsWrapper.style.display = 'block';
}
//ыбор градусов
function chooseDegrees(e){
    selectricItemsWrapper.removeAttribute("style");
    // weatherDegreeSpan.textContent = e.textContent;
    selectricLabel = e.textContent;

}
//клик по меню
function checkDataDay(nav, day){
    changeActiveNav (nav);
    console.log(day);
/*
    switch (day) {
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
*/
}
function changeActiveNav (nav){
    navElemS.map(el => el.classList.remove('active'));
    nav.classList.add('active');
}
function checkGeolocation(){
    navigator.geolocation ? getCoords() : h1.textContent = 'unlock your location';
}
function getCoords(){
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        getWeatherAPI(long, lat);
    })
}
async function getWeatherAPI(long, lat){
    const proxy = "https://cors-anywhere.herokuapp.com/"; // чтобы локально достучаться
    let url = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
    const response = await fetch(`${proxy}${url}`);
    const data = await response.json();
    addContent(data)
}
function addContent(data){
    const {temperature, summary, icon} = data.currently;
    weatherDegreeNumtextContent = temperature;
    weatherDescription.textContent = summary;

    setIcons(icon, iconElem);
    createBlockTemplate()
}
function createBlockTemplate() {

    weatherSection.append(createWeatherBlock);

}
function setIcons(icon, iconID) {
    const skycons = new Skycons({"color": "pink"});
    const CurrentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    console.log(CurrentIcon);
    return skycons.set(iconID, Skycons[CurrentIcon]);
}
window.addEventListener('load', () => {
    checkGeolocation();
});