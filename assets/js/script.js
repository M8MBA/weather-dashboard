const api = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "&appid=570286871b5c0890a480ac56f524ebc1";

var submitBtn = document.getElementById("btn");
var city = [];

var cityFormEl = document.querySelector("#user-form")
var cityInputEl = document.querySelector("#city")

// save data to local storage
function save() {
  localStorage.setItem("city", JSON.stringify(city));
}

// retrieve data to display
function load() {
  cities = JSON.parse(localStorage.getItem("city")) || [];
}

// collect city input

// $(document).ready(function () {
//   load();

//   if (cities[0]) {
//     getCity(cities[cities.length - 1]);
//   }

//   displayCities();
// }

// var getCityInfo = function() {
//   console.log("function was called");
// };

// getCityInfo();

// parse for info I want from api url

// get city weather

// var cityInputEl = document.querySelector("#city");

// var formSubmitHandler = function(event) {
//   // prevent page from refreshing
//   // event.preventDefault();
//   // get value from input element
//   var city = cityInputEl.value.trim();

//   if (city) {
//     getCityInfo(city);
//   } else {
//     alert("Please enter a city");
//   }
// };

// var getCityInfo = function(city) {
//   // format the weather api url
//   var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=name&appid=570286871b5c0890a480ac56f524ebc1";

// api.openweathermap.org/data/2.5/weather?q={cityname}&appid=570286871b5c0890a480ac56f524ebc1&units=metric";



  // make a request to url
//   fetch(apiUrl)
//     .then(function(response) {
//       // request was successful
//       if (response.ok) {
//         console.log(response)
//         response.json().then(function(data) {
//           console.log(data);
//           displayCity(data, name);
//         });
//       } else {
//         alert("Error: " + response.statusText);
//       }
//     })
//     .catch(function(error) {
//       alert("Unable to connect to weather data");
//     });
// };

// var displayCity = function(name, searchTerm) {
  
// }

userFormEl.addEventListener("submit", formSubmitHandler);