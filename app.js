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
weatherDegreeSpan.textContent = selectricLabel.textContent;let createWeatherDegreeWrapper = document.createElement('div');
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
function chooseDegrees(e){
    selectricItemsWrapper.removeAttribute("style");
    // weatherDegreeSpan.textContent = e.textContent;
    selectricLabel = e.textContent;

}
//клик по меню
function checkDataDay(nav, day){
    changeActiveNav (nav);
    weatherSection.innerHTML  = '';
    if (day === 'today' || day === 'tomorrow' ) {
        weatherSection.append(createWeatherBlock);
        createBlockTemplate(day);
    }
    createBlockTemplate(day);

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
    // if (day === 'today') {
    //     updateElem();
    //     addContentToday(data);
    // }else if (day === 'tomorrow') {
    //     updateElem();
    //     addContentTomorrow(data)
    // }else if (day === 'threeDays'){
    //     addContentSomeDays(data, 3)
    // }else if (day === 'week'){
    //     addContentSomeDays(data, 7)
    // }else{
    //     updateElem();addContentToday(data);}
    switch (day) {
        case 'today':
            updateElem();
            addContentToday(data);
            break;
        case 'tomorrow':
            updateElem();
            addContentTomorrow(data);
            break;
        case "threeDays":
            addContentSomeDays(data, 3);
            break;
        case 'week':
            addContentSomeDays(data, 7);
            break;
        default:
            updateElem();
            addContentToday(data);
    }


}

function addContentSomeDays(data, day){
    const weatherBlocks = data.daily.data.slice(0, day);
    if (weatherSection.hasChildNodes()) weatherSection.innerHTML  = '';
    weatherBlocks.forEach((el, index) => {

        // createWeatherBlock.id = `weather-block${index}`;
        // canvas.id = `icon${index}`;
        const {weatherDegreeNum, weatherDescription, iconElem} = updateElemForMoreDays(index);
        console.log(weatherDegreeNum, weatherDescription, iconElem);
        // weatherSection.insertAdjacentHTML('beforeend', createWeatherBlock.outerHTML );
        const {temperatureMax, temperatureMin, summary, icon} = el;
        const temperature = (temperatureMax + temperatureMin) / 2;

        // let weatherDegreeNum = document.querySelector(`#weather-block${index} .weather-degree_num`);
        // let weatherDescription = document.querySelector(`#weather-block${index} .weather-description`);
        weatherDegreeNum.textContent = temperature.toFixed(2);
        weatherDescription.textContent = summary;
        // iconElem = document.getElementById(`icon${index}`);

        setIcons(icon, iconElem);

        // weatherSection.insertAdjacentHTML('beforeend', '<div id="test">test</div>' )

    });
    // const {temperature, summary, icon} = data.currently;
    // weatherDegreeNum.textContent = temperature;
    // weatherDescription.textContent = summary;
    // setIcons(icon, iconElem);
    // console.log(weatherDegreeNum, "555")

}
function addContentToday(data){
    console.log(data, '2');
    const {temperature, summary, icon} = data.currently;
    weatherDegreeNum.textContent = temperature;
    weatherDescription.textContent = summary;
    setIcons(icon, iconElem);
    console.log(weatherDegreeNum, "555")

}
function addContentTomorrow(data){
    const icon = data.daily.data[0].icon;
    weatherDegreeNum.textContent = data.daily.data[0].temperatureHigh;
    weatherDescription.textContent = data.daily.data[0].summary;
    setIcons( icon, iconElem);
    console.log(weatherDegreeNum, "555")
}
function createBlockTemplate(day) {
    // console.log("ddd");
    // if (weatherSection.hasChildNodes()) weatherSection.innerHTML  = '';
    // weatherSection.append(createWeatherBlock);
    setTimeout(() => getWeatherAPI(long, lat, day), 500);
    // getWeatherAPI(long, lat);console.log("append");
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