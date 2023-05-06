require('dotenv').config();

let lat = 43.67;
let lon = -79.37;
let exclude = 'minutely,hourly';
let key = process.env.WEATHER_API_KEY;
console.log(key)
let endPoint = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${key}`;

fetch(endPoint)
  .then(res => res.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.log('Error:', error);
  });