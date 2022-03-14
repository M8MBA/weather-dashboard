var api = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiKey = "&appid=570286871b5c0890a480ac56f524ebc1";
var geoApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + apiKey;
// uv index
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// geo code API
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

var cities = [];
cities.reverse();
// here it makes sense to use 'cities' rather than 'city' as I am retrieving 200,000 cities from API
// retrieve data to display
function load() {
  cities = JSON.parse(localStorage.getItem("cities")) || [];
}
// save data to local storage
function save() {
  localStorage.setItem("cities", JSON.stringify(cities));
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
  var apiUrl = api + city + "&units=imperial" + apiKey;
 

  // retrieve API data using AJAX
  $.ajax({ url: apiUrl, type: "GET" }).then(function (response) {
    console.log(response);

    // ICON
    var iconJson = response.weather[0].icon; // path
    var iconHttp = "http://openweathermap.org/img/wn/" + iconJson + "@2x.png"; // source
    var iconImg = $("<img>").addClass("icon"); // create element
    iconImg.attr("src", iconHttp); // .attr() gives value to img element
    $(".current-city").text(response.name + " (" + currentDate + ")"); // display city, current temp, & icon
    $(".current-city").append(iconImg); // append icon
    // convert temperature
    var farenheit = (response.main.temp - 273.15) * 1.8 + 32;
    // $("#farenheit").text("Temperature (Kelvin) " + farenheit);
    // display temperature
    $("#temp").text("Temp: " + response.main.temp + " °F");
    // display wind
    $("#wind").text("Wind: " + response.wind.speed + " MPH");
    // display humidity
    $("#humidity").text("Humidity: " + response.main.humidity + " %");
    // displays uv index
    // $("#uvindex").text("UV Index: " + getUvi).addClass(); // ?????
    getUvi(response.coord.lat, response.coord.lon); // ?????
    forecast(city);
    // input.val("");
  });  
}

// display searched Cities
function displayCities() {
  var limit;

  if (cities.length < 10) {
    limit = cities.length;
  } else {
    limit = 10;
  }
  $("#city-history").html("");
  for (var c = 0; c < limit; c++) {
    var cityHistory = $("<div>");
    cityHistory.addClass("city-col")
    cityHistory.html(cities[c]);
    $("#city-history").prepend(cityHistory);
    //OnClick event on each previously searched city
    cityHistory.attr("id", `${cities[c]}`);
    $(`#${cities[c]}`).on("click", function () {
      getCity($(this).text());
    });
  }
}

//getUV; https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}; lat lon apikey required
function getUvi(lat, lon) {
  var uviUrl = "https://api.openweathermap.org/data/2.5/onecall?" 
    + "lat=" + lat + "&lon=" + lon + apiKey;

  $.ajax({ url: uviUrl, type: "GET" }).then(function (response) {
    console.log(response);
    var uvi = response.current.uvi;
    $("#uvindex").text( uvi);

    // uv background color
    let uvcolor = uvi;
      $("#uvindex").removeClass();

    if (uvcolor < 2) {
      $("#uvindex").addClass("green");
      console.log('green')
    }  else if (uvcolor <= 7) {
      $("#uvindex").addClass("yellow");
      console.log('yellow');
    } else if (uvcolor > 7) {
      $("#uvindex").addClass("red");
      console.log('red');
    }

  });
}

// 5 day forecast
function forecast(city) {
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey;
  $.ajax({ url: forecastURL, type: "GET" }).then(function (response) {
    var list = response.list;
    console.log(response);
    // for each iteration of our loop
    $("#forecast").html("");
    for (var i = 39; i >= 0; i = i - 8) {
      var temp = ((list[i].main.temp - 273.15) * 1.8 + 32).toFixed(2);
      var iconId = list[i].weather[0].icon;
      var humidity = list[i].main.humidity;
      var wind = list[i].wind.speed;
      var date = new Date(list[i].dt_txt);
      var day = date.getDate();
      var month = date.getMonth();
      var year = date.getFullYear();
      var formatedDate = `${month + 1}/${day - 1}/${year}`;
      // Creating and storing a div tag
      var col = $("<div>");
      col.addClass("col");
      var mycard = $("<div>");
      mycard.addClass("card")
      col.append(mycard);
      // Creating a paragraph tag with the response item
      var p = $("<p>").text(formatedDate).addClass("forecast-date");
      // Creating and storing an image tag
      var iconUrl = "https://openweathermap.org/img/wn/" + iconId + "@2x.png";
      var weatherImage = $("<img>").addClass("icon");
      // Setting the src attribute of the image to a property pulled off the result item
      weatherImage.attr("src", iconUrl);
      var p1 = $("<p>").text("Temp: " + temp + " °F");
      var p2 = $("<p>").text("Wind: " + wind + " MPH");
      var p3 = $("<p>").text("Humidity: " + humidity + " %");
      // Appending the paragraph and image tag to mycard
      mycard.append(p);
      mycard.append(weatherImage);
      mycard.append(p1);
      mycard.append(p2);
      mycard.append(p3);
      // Prependng the col to the HTML page in the "#forecast" div
      $("#forecast").prepend(col);
    }
  });
}
