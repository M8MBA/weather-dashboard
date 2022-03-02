const api = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "&appid=570286871b5c0890a480ac56f524ebc1";

// var submitBtn = document.getElementById("btn");

var cities = [];

// here it makes sense to use 'cities' rather than 'city' as I am retrieving 200,000 cities from API

// save data to local storage
function save() {
  localStorage.setItem("cities", JSON.stringify(cities));
}

// retrieve data to display
function load() {
  cities = JSON.parse(localStorage.getItem("cities")) || [];
}


// jQuery selector and method to make function available after document is loaded
$(document).ready(function () {
  load();

  if (cities[0]) {
    getCity(cities[cities.length - 1]); // define getCity below
  }
  // calls the function
  displayCities();

  $("#btn").on("click", function (event) {
    event.preventDefault();

    // manipulating the class on input element >> class
    var input = $(".city-input")
    // use city here as we are retrieving 1 city upon input
    // .val() will set the value of the <input> field (jQuery method)
    var city = input.val();

    if (!cities.includes(city)) { // ! invert value ,, city = searchvalue
      cities.push(city);
      save ();
    }

    // call functions
    displayCities();
    getCity(city);

  });

});

// get city weather conditions
function getCity(city) {
  // moment.js date format
  var currentDate = moment().format("LL");
  // API URL
  var apiUrl = "api" + city + "&units=imperial" + "apiKey";

  // retrieve API data using AJAX
  $.ajax({ url: apiUrl, type: "GET" }).then(function (response) {
    // weather icon
    var iconLocation = response.weather[0].icon;
    // set the attribute and value, $(selector).attr(attribute,value)
    var iconApi = "https://openweathermap.org/img/wn" + iconLocation + "@2x.png";
    var iconImg = $("<img>");
    iconImg.attr("src", iconApi); 

    // display searched city, current date as well as the icon
    $("current-city").text(response.name + " (" + currentDate + ")");
    $("current-city").append(iconImg);
    // convert temperature
    var farenheit = (response.main.temp - 273.15) * 1.8 +32;
    $(".farenheit").text("Temperature (Kelvin) " + farenheit);
    // display temperature
    $("temp").text("Temp: " + response.main.temp + " °F");
    // display wind
    $("wind").text("Wind: " + response.main.wind + " MPH");
    // display humidity
    $("humidity").text("Humidity: " + response.main.humidity + " %");
          // $("uvindex").text("UV Index: " + response.main.)
    // dipslay UV Index via retrieving latitude and longitude from API
    uvIndex(response.coord.lat, response.coord.lon); 

    forecast(city);
    input.val("");

  });  


}

// displayCities
function displayCities() {
  var limit;

  if (cities.length < 10) {
    limit = cities.length;
  } else {
    limit = 10;
  }

}


// 5 day forecast


// UV index