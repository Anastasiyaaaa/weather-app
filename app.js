let long;
let lat;
let weatherArr = [];
let weatherSection = document.querySelector('.weather');
let weatherBlock, canvas, degreeWrapper, weatherDegreeNum, weatherDegree,weatherSummary;

window.addEventListener('load', () => {
    checkGeolocation();
});
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
    createWeatherArr(data);
}
function createWeatherArr(data){
    const {temperature, summary, icon} = data.currently;
    const tempDegreeC = Math.floor( (+temperature - 32) * (5 / 9) );
    weatherArr[0] = {
        temperatureK: {temperature, degree: '˚F, mph',},
        temperatureC: {temperature: tempDegreeC , degree: '˚C, m/s',},
        summary, icon, iconIndex: 'icon0'};
    data.daily.data.slice(1).forEach((el, index) => {
        const {temperatureMax, temperatureMin, summary, icon} = el;
        const tempDegreeK = Math.floor((temperatureMax + temperatureMin) / 2);
        const tempDegreeC = Math.floor( (+temperature - 32) * (5 / 9) );


        weatherArr.push({
            temperatureK: {temperature: tempDegreeK , degree: '˚F, mph',},
            temperatureC: {temperature: tempDegreeC , degree: '˚C, m/s',},
            summary, icon, iconIndex: `icon${++index}`});
    });
    createWeatherBlock();
}
function createWeatherBlock() {
    weatherBlock = document.createElement('div');
    weatherBlock.className = "weather-block";
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', '128');
    canvas.setAttribute('height', '128');
    degreeWrapper = document.createElement('div');
    weatherDegreeNum = document.createElement('span');
    weatherDegreeNum.className = "weather-degree_num";
    weatherDegree = document.createElement('span');
    weatherDegree.className = "weather-degree";
    degreeWrapper.append(weatherDegreeNum, weatherDegree);
    weatherSummary = document.createElement('div');
    weatherSummary.className = "weather-description";
    weatherBlock.append(canvas, degreeWrapper,weatherSummary );
    setContent(0, 1);
}
function setContent(since, to) {
    console.log(weatherArr);
    weatherArr.slice(since, to).forEach((e) => {
        canvas.id = e.iconIndex;
        weatherDegreeNum.textContent = e.temperatureK.temperature;
        weatherDegree.textContent = e.temperatureK.degree;
        weatherSummary.textContent = e.summary;
        weatherSection.insertAdjacentHTML('beforeend', weatherBlock.outerHTML);
        setIcons(e.icon, e.iconIndex);
    });
}

function setIcons(icon, iconIndex) {
    const skycons = new Skycons({"color": "pink"});
    const CurrentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconIndex, Skycons[CurrentIcon]);
}