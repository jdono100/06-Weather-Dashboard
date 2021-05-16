# 06-Weather-Dashboard


## Overview
This week in our Northwestern Coding Boot Camp we had to find time to make a simple weather dashboard! Along with [OpenWeatherAPI](https://openweathermap.org/), I made this using [jQuery](https://jquery.com/), [Materialize](https://materializecss.com/), and [Google Material Icons](https://fonts.google.com/icons?selected=Material+Icons). Using OpenWeatherAPI, one can glean a vast amount of data about the weather from a simple API call.

<a href="https://jdono100.github.io/06-Weather-Dashboard">Click</a> to view the dashboard.

## User Story
```
As an avid outdoorsperson,
I would like to see the weather for various locations
so that I can dress appropriately and plan my days accordingly
```

## Functionality Information

* I used fetch instead of ajax, ajax gives me headaches

* Displays the following weather information using the Weather API:

    * City Name

    * Correct Date

    * Weather Icon

    * Temperature

    * Humidity

    * Wind Speed

* And using the OneCall API, I was able to display:

    * The UV Index for the current day

    * The temp, humidity, and wind speed of the next 5 days

* Also includes `localStorage` functionality that saves recent searches and applies them to the page

* Has a clear button that empties the `localStorage` list if it gets too long

## What I'd Still Like to be Done

* Add functionality to the recent searches to have them be a button that links to that cities weather page

* Make it so that there is a limit to the amount of recent searches that can be on the screen at once

* Clean up the styling