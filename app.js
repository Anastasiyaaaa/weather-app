let long;
let lat;


let navElemS = Array.from(document.querySelectorAll('.menu li'));
//беру элеменьты из DOM
let weatherSection, iconElem, weatherDegreeNum, weatherDegreeSpan, weatherDescription,
    selectric, selectricLabel, selectricItemsWrapper, selectricItems;
//обновляю элеменьты из DOM
function updateElem() {
    canvas.id = "icon";
    weatherSection = document.querySelector('.weather');
    iconElem = document.getElementById('icon');
    weatherDegreeNum= document.querySelector('.weather-degree_num');
    weatherDegreeSpan = document.querySelector('.weather-degree');
    weatherDescription = document.querySelector('.weather-description');
    // выбор температуры в чём показывать
    selectric = document.querySelector('.selectric-button');
    selectricLabel = document.querySelector('.selectric-label');
    weatherDegreeSpan.textContent = selectricLabel.textContent;
    selectricItemsWrapper = document.querySelector('.selectric-items-wrapper');
    selectricItems = document.querySelectorAll('.selectric-items li');
}
function updateElemForMoreDays(index){
    let createWeatherBlockDays = createWeatherBlock;
    createWeatherBlockDays.id = `weather-block${index}`;
    let canvasDays = canvas;
    canvasDays.id = `icon${index}`;
    weatherSection.insertAdjacentHTML('beforeend', createWeatherBlockDays.outerHTML );
    let weatherDegreeNum = document.querySelector(`#weather-block${index} .weather-degree_num`);
    let weatherDescription = document.querySelector(`#weather-block${index} .weather-description`);
    let iconElem = document.getElementById(`icon${index}`);
    weatherDegreeSpan = document.querySelector('.weather-degree');
    weatherDegreeSpan.textContent = selectricLabel.textContent;
    return {weatherDegreeNum,  weatherDescription,  iconElem}
}

// создаю элементы
let createWeatherBlock = document.createElement('div');
createWeatherBlock.className = "weather-block";
let canvas = document.createElement('canvas');
canvas.id = "icon";
canvas.setAttribute('width', '128');
canvas.setAttribute('height', '128');
weatherDegreeSpan = document.querySelector('.weather-degree');
selectricLabel = document.querySelector('.selectric-label');
weatherDegreeSpan.textContent = selectricLabel.textContent;
let createWeatherDegreeWrapper = document.createElement('div');
let createSpanWeatherDegree = document.createElement('span');
createSpanWeatherDegree.className = "weather-degree";
let createweatherDegreeNum = document.createElement('span');
createweatherDegreeNum.className = "weather-degree_num";
createWeatherDegreeWrapper.append(createweatherDegreeNum, createSpanWeatherDegree);
let createWeatherDescription = document.createElement('div');
createWeatherDescription.className = "weather-description";
createWeatherBlock.append(canvas, createWeatherDegreeWrapper,createWeatherDescription );


//клик по выборы температуры
function showDegreesVariants(){
    selectricItemsWrapper.style.display = 'block';
}
//ыбор градусов
function chooseDegrees(degree){
    selectricItemsWrapper.removeAttribute("style");
    // weatherDegreeSpan.textContent = e.textContent;
    console.log(selectricLabel);
    selectricLabel.textContent = degree.textContent;
    updateDegreeNum(degree);

}
function updateDegreeNum(degree) {
    let weatherBlocks = document.querySelectorAll('.weather-block');
    console.log(weatherBlocks);
    weatherBlocks.forEach( block =>{
        block.querySelector('.weather-degree').textContent = degree.textContent;
        if (degree.textContent === '˚C, m/s') {
            block.querySelector('.weather-degree_num').textContent = updateDegreeToCelsius(block.querySelector('.weather-degree_num').textContent);
        } else if (degree.textContent === '˚F, mph') {
            block.querySelector('.weather-degree_num').textContent = updateDegreeToFahrenheit(block.querySelector('.weather-degree_num').textContent);
        }
        // block.querySelector('.weather-degree_num').textContent = degree.textContent;
    })
}

function updateDegreeToCelsius(temp){
    console.log(temp);
    let newDegree = (+temp - 32) * (5 / 9);
    return Math.floor(newDegree);
}
function updateDegreeToFahrenheit(temp){
    let newDegree = (+temp * (9 / 5) + 32);
    return  Math.floor(newDegree);
}
//клик по меню
function checkDataDay(nav, day){
    changeActiveNav (nav);
    weatherSection.innerHTML  = '';
    if (day === 'now' || day === 'tomorrow' ) {
        weatherSection.append(createWeatherBlock);
        updateElem();
        getWeatherAPI(long, lat, day);
    }
    getWeatherAPI(long, lat, day);
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
    switch (day) {
        case 'now':
            addContentToday(data);
            break;
        case 'tomorrow':
            addContentTomorrow(data);
            break;
        case "threeDays":
            addContentSomeDays(data, 4);
            break;
        case 'week':
            addContentSomeDays(data, 8);
            break;
        default:
            updateElem();
            addContentToday(data);
    }


}

function addContentSomeDays(data, day){
    const weatherBlocks = data.daily.data.slice(1, day);
    weatherBlocks.forEach((el, index) => {
        const {weatherDegreeNum, weatherDescription, iconElem} = updateElemForMoreDays(index);
        const {temperatureMax, temperatureMin, summary, icon} = el;
        const temperature = (temperatureMax + temperatureMin) / 2;
        weatherDegreeNum.textContent = temperature.toFixed(2);
        if (selectricLabel.textContent === '˚C, m/s'){
            console.log(weatherDegreeNum);
            let newf = updateDegreeNum(selectricLabel.textContent);
            console.log(newf);
        }
        weatherDescription.textContent = summary;
        setIcons(icon, iconElem);
    });

    // updateDegreeNum(selectricLabel.textContent);
}
function addContentToday(data){
    const {temperature, summary, icon} = data.currently;
    weatherDegreeNum.textContent = temperature;
    weatherDescription.textContent = summary;
    setIcons(icon, iconElem);
}
function addContentTomorrow(data){
    const icon = data.daily.data[1].icon;
    weatherDegreeNum.textContent = ((data.daily.data[1].temperatureMax + data.daily.data[1].temperatureMin) / 2).toFixed(2);
    weatherDescription.textContent = data.daily.data[1].summary;
    setIcons( icon, iconElem);
}

function setIcons(icon, iconID) {
    const skycons = new Skycons({"color": "pink"});
    const CurrentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[CurrentIcon]);
}
window.addEventListener('load', () => {
    checkGeolocation();
});