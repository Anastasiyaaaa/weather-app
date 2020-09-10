let long;
let lat;

let iconElem = document.querySelector('#icon');
// создаю элементы
let weatherSection = document.querySelector('.weather');
let divWeatherBlock = document.createElement('div');
divWeatherBlock.className = "weather-block";
let canvas = document.createElement('canvas');
canvas.id = "icon";
canvas.setAttribute('width', '128');
canvas.setAttribute('height', '128');
let divWeatherDegree = document.createElement('div');
divWeatherDegree.className = "weather-degree";
let spanWeatherDegree = document.createElement('span');
divWeatherDegree.append(spanWeatherDegree);
let divWeatherDescription = document.createElement('div');
divWeatherDescription.className = "weather-description";
divWeatherBlock.append(canvas, divWeatherDegree,divWeatherDescription );

function checkDataDay(day){
    console.log(day);
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

    setIcons(icon, iconElem);
    createBlockTemplate()
}
function createBlockTemplate() {

    weatherSection.append(divWeatherBlock);

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