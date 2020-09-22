let long;
let lat;


let navElemS = Array.from(document.querySelectorAll('.menu li'));
//беру элеменьты из DOM
let weatherSection, iconElem, weatherDegreeNum, spanWeatherDegreeNum, weatherDescription,
    selectric, selectricLabel, selectricItemsWrapper, selectricItems;
//обновляю элеменьты из DOM
function updateElem() {
    weatherSection = document.querySelector('.weather');
    iconElem = document.getElementById('icon');
    weatherDegreeNum= document.querySelector('.weather-degree_num');
    spanWeatherDegreeNum = document.querySelector('.weather-degree_num');
    weatherDescription = document.querySelector('.weather-description');
    // выбор температуры в чём показывать
    selectric = document.querySelector('.selectric-button');
    selectricLabel = document.querySelector('.selectric-label');
// weatherDegreeSpan.textContent = selectricLabel.textContent;
    selectricItemsWrapper = document.querySelector('.selectric-items-wrapper');
    selectricItems = document.querySelectorAll('.selectric-items li');
}

// создаю элементы
let createWeatherBlock = document.createElement('div');
createWeatherBlock.className = "weather-block";
let canvas = document.createElement('canvas');
canvas.id = "icon";
canvas.setAttribute('width', '128');
canvas.setAttribute('height', '128');
let createWeatherDegreeWrapper = document.createElement('div');
let createSpanWeatherDegree = document.createElement('span');
createSpanWeatherDegree.className = "weather-degree";
let createSpanWeatherDegreeNum = document.createElement('span');
createSpanWeatherDegreeNum.className = "weather-degree_num";
createWeatherDegreeWrapper.append(createSpanWeatherDegreeNum, createSpanWeatherDegree);
let createWeatherDescription = document.createElement('div');
createWeatherDescription.className = "weather-description";
createWeatherBlock.append(canvas, createWeatherDegreeWrapper,createWeatherDescription );


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
    switch (day) {
        case 'today':
            createBlockTemplate(day);
            break;
        case 'tomorrow':
            createBlockTemplate(day);
            break;
        case "threeDays":
            console.log(day);
            weatherSection.innerHTML  = '';
            break;
        case 'week':
            console.log(day);
            weatherSection.innerHTML  = '';
            break;
    }
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
async function getWeatherAPI(long, lat, day){
    const proxy = "https://cors-anywhere.herokuapp.com/"; // чтобы локально достучаться
    let url = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
    const response = await fetch(`${proxy}${url}`);
    const data = await response.json();
    console.log(data);
    updateElem();
    if (day === 'today') {
        addContentToday(data);
    }else if (day === 'tomorrow') {
        addContentTomorrow(data)
    }else{addContentToday(data);}

}
function join() {
    
}
function addContentToday(data){
    console.log(data, '2');
    const {temperature, summary, icon} = data.currently;
    spanWeatherDegreeNum.textContent = temperature;
    weatherDescription.textContent = summary;
    setIcons(icon, iconElem);
    console.log(spanWeatherDegreeNum, "555")
    // createBlockTemplate()
}
function addContentTomorrow(data){
    const icon = data.daily.data[0].icon;
    spanWeatherDegreeNum.textContent = data.daily.data[0].temperatureHigh;
    weatherDescription.textContent = data.daily.data[0].summary;
    setIcons( icon, iconElem);
    console.log(spanWeatherDegreeNum, "555")
    // createBlockTemplate()
}
function createBlockTemplate(day) {
    console.log("ddd");
    if (weatherSection.hasChildNodes()) weatherSection.innerHTML  = '';
    weatherSection.append(createWeatherBlock);
    setTimeout(() => getWeatherAPI(long, lat, day), 2000);
    // getWeatherAPI(long, lat);
    console.log("append");
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