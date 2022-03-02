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

    var iconApi = "https://openweathermap.org/img/wn" + iconLocation + "@2x.png";
    var iconImg = $("<img>");
    
    iconImg.attr("src", iconApi);


  });  


}

// displayCities
