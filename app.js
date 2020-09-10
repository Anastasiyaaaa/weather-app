let long;
let lat;
function checkDataDay(e){
    console.log(e.dataset.day);
}
function checkGeolocation(){
    navigator.geolocation ? getCoords() : h1.textContent = 'unlock your location';
}
function getCoords(){
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
    })
}
async function getWeatherAPI(){
    const proxy = "https://cors-anywhere.herokuapp.com/"; // чтобы локально достучаться
    let url = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
    const response = await fetch(`${proxy}${url}`);
    const data = await response.json();
    return console.log(data)
}
window.addEventListener('load', () => {
    checkGeolocation();
    getWeatherAPI();

});