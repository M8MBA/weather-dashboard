var api = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiKey = "&appid=570286871b5c0890a480ac56f524ebc1";

// var submitBtn = document.getElementById("btn");

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
    // weather icon
    var iconLocation = response.weather[0].icon;
    // set the attribute and value, $(selector).attr(attribute,value)
    //  var iconApi = ;
    var iconImg = $("<img>");
    iconImg.attr("src", iconApi); 

    // display searched city, current date as well as the icon
    $(".current-city").text(response.name + " (" + currentDate + ")");
    $(".current-city").append(iconImg);
    // convert temperature
    var farenheit = (response.main.temp - 273.15) * 1.8 +32;
    $("#farenheit").text("Temperature (Kelvin) " + farenheit);
    // display temperature
    $("#temp").text("Temp: " + response.main.temp + " °F");
    // display wind
    $("#wind").text("Wind: " + response.main.wind + " MPH");
    // display humidity
    $("#humidity").text("Humidity: " + response.main.humidity + " %");
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

  $("#city-history").html("");
  for (var c = 0; c < limit; c++) {
    var cityHistory = $("<div>");
    cityHistory.addClass("row").css({
      textAlign: "center",
      border: "1px solid silver",
      height: "50px",
      lineHeight: "50px",
      paddingLeft: "40px",
    });
    cityHistory.html(cities[c]);
    $("#city-history").prepend(cityHistory);

    //OnClick event on each city
    cityHistory.attr("id", `${cities[c]}`);
    $(`#${cities[c]}`).on("click", function () {
      getCity($(this).text());
    });
  }
}

//getUV;
function getUV(lat, lon) {
  var uvIndexURL =
    "https://api.openweathermap.org/data/2.5/uvi/forecast?" +
    apiKey +
    "&lat=" +
    lat +
    "&lon=" +
    lon +
    "&cnt=1";
  $.ajax({ url: uvIndexURL, type: "GET" }).then(function (response) {
    $("#uv").text("UV-index : " + response[0].value);
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
      var date = new Date(list[i].dt_txt);

      var day = date.getDate();
      var month = date.getMonth();
      var year = date.getFullYear();

      var formatedDate = `${month + 1}/${day}/${year}`;
      // Creating and storing a div tag
      var col = $("<div>");
      col.addClass("col");
      var mycard = $("<div>");
      mycard.addClass("card");
      col.append(mycard);

      // Creating a paragraph tag with the response item
      var p = $("<p>").text(formatedDate);
      // Creating and storing an image tag

      var iconUrl = "https://openweathermap.org/img/wn/" + iconId + "@2x.png";

      var weatherImage = $("<img>");
      // Setting the src attribute of the image to a property pulled off the result item
      weatherImage.attr("src", iconUrl);

      var p1 = $("<p>").text("Temp: " + temp + "°F");
      var p2 = $("<p>").text("Humidity: " + humidity + "%");

      // Appending the paragraph and image tag to mycard
      mycard.append(p);
      mycard.append(weatherImage);
      mycard.append(p1);
      mycard.append(p2);

      // Prependng the col to the HTML page in the "#forecast" div

      $("#forecast").prepend(col);
    }
  });
}


// UV index