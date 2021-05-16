// Global vars
var city = $("#searchInput");
var searchButton = $("#searchButton");
var clearButton = $("#clearButton");
var recentSearches = $(".recentSearchList")
var resultsDiv = $(".resultsDiv");
var currentWeatherDiv = $("#currentWeatherDiv");
var forecastDiv = $("#forecastDiv");
var forecastCity = $("#forecastCity");
//Empty array for localStorage
var cityList = [];


// Hide blank content
recentSearches.hide();
resultsDiv.hide();
currentWeatherDiv.hide();
forecastDiv.hide();

// Init localStorage function
initHistory();

// Keypress listener so user can press enter or the search button
city.keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        searchButton.click();
    }
});


searchButton.on("click", function() {
    // Get user's search input
    var cityInput = city.val();
    // console.log(cityInput);
    setRecentSearches(cityInput)
    // Empty the search field
    city.val("");
    
    // Call api
    var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=a568ad4189eb40bd0067f014d53aef74`
    fetch(queryUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // console.log(data);
        getCurrentConditions(data);
    });
});

// Event listener to clear the recent searches
clearButton.on("click", function() {
    cityList = [];
    listRecentSearches();
    $(this).hide();
})
// Init clear button if there's text in recentSearches
showClearButton();
recentSearches.on("click","a.btn", function() {
    var searchVal = $(this).data("value");
    getCurrentConditions(searchVal);
})

// Get data for and set the currentWeatherDiv
getCurrentConditions = (data) => {
    
    // Round the temperature so it's nice and readable
    var roundedTemp = Math.round(data.main.temp);
    // Get the uv index with another fetch
    var cityLat = data.coord.lat;
    var cityLon = data.coord.lon;
    uviUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&exclude=minutely,hourly&appid=a568ad4189eb40bd0067f014d53aef74`
    fetch(uviUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(UVIdata){
            // console.log(UVIdata);
            // Assign and append results
            currentWeatherDiv.empty();
            var date = new Date((UVIdata.current.dt)*1000);
            var cityTitle = $("<h3>").text(data.name);
            var currentData = $("<h4>").text(new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(date));
            var weatherIcon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            var currentTemp = $("<h5>").addClass("currentTemp").text(`${roundedTemp}°F`);
            var currentHumid = $("<p>").addClass("currentHumid").text(`Humidity: ${data.main.humidity}%`);
            var currentWind = $("<p>").addClass("currentWind").text(`Wind Speed: ${UVIdata.current.wind_speed} MPH`);
            var uvIndex = UVIdata.current.uvi;
            var currentUVI = $("<p>").text(`UV Index: `);
            var uvColorBg = $("<span>").text(uvIndex).addClass("center uvText")
            if (uvIndex < 3) {
                uvColorBg.addClass("low");
            } else if (uvIndex < 7) {
                uvColorBg.addClass("moderate");
            } else {
                uvColorBg.addClass("high");
            };
            // console.log(uvIndex);
            currentUVI.append(uvColorBg);

            currentWeatherDiv.append(cityTitle, currentData, weatherIcon, currentTemp, currentHumid, currentWind, currentUVI);
            // Show results & call forecast
            currentWeatherDiv.show();
            resultsDiv.show();
            getForecast(UVIdata);
            forecastDiv.show();
        })
    
    }

// Function for getting/setting forecast data
getForecast = (UVIdata) => {
    var oneCallData = UVIdata;
    // console.log(oneCallData);
    // Empty the forecasts div & apply the header
    forecastDiv.empty();
    var forecastHeader = $("<h3>").text(`5 Day Forecast:`);
    forecastDiv.append(forecastHeader);
    // Iterate through the 2nd through 6th days, as the current day is being displayed above
    for (i = 1; i < 6; i++) {
        // Create and append forecasts
        var forecastRoundedTemp = Math.round(oneCallData.daily[i].temp.day) || [];
        var forecastDate = new Date((oneCallData.daily[i].dt)*1000);
        var options = {weekday: "long", month: "numeric", day: "numeric", year: "numeric"};
        var colDiv = $("<div>").addClass("col s12 m6 l2");
        var cardDiv = $("<div>").addClass("card medium");
        var cardContentDiv = $("<div>").addClass("card-content");
        var titleSpan = $("<h4>").addClass("card-title flow-text").text(forecastDate.toLocaleDateString("en-US", options));
        var forecastIcon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${oneCallData.daily[i].weather[0].icon}.png`).addClass("responsive-img");
        var forecastTemp = $("<p>").addClass("forecastTemp flow-text").text(`${forecastRoundedTemp}°F`);
        var forecastHumid = $("<p>").addClass("forecastHumid flow-text").text(`Humidity: ${oneCallData.daily[i].humidity}%`);
        var forecastWind = $("<p>").addClass("forecastWind flow-text").text(`Wind: ${oneCallData.daily[i].wind_speed} MPH`);
        cardContentDiv.append(titleSpan, forecastIcon, forecastTemp, forecastHumid, forecastWind);
        cardDiv.append(cardContentDiv);
        colDiv.append(cardDiv);
        forecastDiv.append(colDiv);
        }
    }

// Function that sets the list of searches and checks if there are any repeats and stops it
setRecentSearches = (cityInput) => {
    if (cityInput) {
        if (cityList.indexOf(cityInput) === -1) {
            cityList.push(cityInput);
            listRecentSearches();
            recentSearches.show();
        } else {
            var spliceItem = cityList.indexOf(cityInput);
            cityList.splice(spliceItem, 1);
            cityList.push(cityInput);
            listRecentSearches();
            recentSearches.show();
            initHistory();
        }
    }
}

// Function to create/apply recent search elements
function listRecentSearches() {
    // Empty the searches div
    recentSearches.empty()
    // Make an item for each city in the list
    cityList.forEach(function(city) {
        var recentSearchLI = $("<li>").addClass("collection-item");
        var recentSearchA = $("<a>").addClass("nowrap").attr("data-value", city);
        recentSearchA.text(city);
        recentSearchLI.append(recentSearchA);
        recentSearches.prepend(recentSearchLI);
    })
    // Set them to localStorage
    localStorage.setItem("Cities:", JSON.stringify(cityList));
    // Show the clear button if it's missing
    showClearButton();
}

// Function to keep history if the user refereshes the page
function initHistory() {
    if (localStorage.getItem("Cities:")) {
        cityList = JSON.parse(localStorage.getItem("Cities:"));
        // console.log(cityList);
        listRecentSearches();
    }
}

// Function to call when we need the clear button to pop up
function showClearButton() {
    if (recentSearches.text() !== "") {
        clearButton.show();
    }
}