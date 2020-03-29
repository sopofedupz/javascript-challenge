// from data.js
var tableData = data;

// creating a function to sort object
function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  };

// passing unique list of cities into drop-down menu
tableData.sort(compareValues('city'));

const uniqueCity = [...new Map(tableData.map(item => [item.city, item])).values()]

uniqueCity.forEach((city) => {
    Object.entries(city).forEach(function([key,value]) {
        if (key === "city") {
            var city_value = d3.select("#city").append("option");
            city_value.text(value);
        }
    })
});

// passing unique list of states into drop-down menu
tableData.sort(compareValues('state'));

const uniqueState = [...new Map(tableData.map(item => [item.state, item])).values()]

uniqueState.forEach((state) => {
    Object.entries(state).forEach(function([key,value]) {
        if (key === "state") {
            var state_value = d3.select("#state").append("option");
            state_value.text(value);
        }
    })
});

// passing unique list of countries into drop-down menu
tableData.sort(compareValues('country'));

const uniqueCountry = [...new Map(tableData.map(item => [item.country, item])).values()]

uniqueCountry.forEach((country) => {
    Object.entries(country).forEach(function([key,value]) {
        if (key === "country") {
            var country_value = d3.select("#country").append("option");
            country_value.text(value);
        }
    })
});


// passing unique list of shapes into drop-down menu
tableData.sort(compareValues('shape'));

const uniqueShape = [...new Map(tableData.map(item => [item.shape, item])).values()]

uniqueShape.forEach((shape) => {
    Object.entries(shape).forEach(function([key,value]) {
        if (key === "shape") {
            var shape_value = d3.select("#shape").append("option");
            shape_value.text(value);
        }
    })
});

// getting the dates and put them in an array
var dates = tableData.map(datetime => datetime.datetime);

// initially set max and min as first element
var max = dates[0],
  min = dates[0];

// iterate over array values and update min & max
dates.forEach(function(v) {
  max = new Date(v) > new Date(max)? v: max;
  min = new Date(v) < new Date(min)? v: min;
});

// check the first and last date in dataset
console.log('max :', max, 'min :', min);

// Update label to reflect start and end date in dataset
label = d3.select("label").text(`Enter Date between ${min} and ${max}`)

// Select the button
var button = d3.select("#filter-btn");

button.on("click", function() {

    // Create function for displaying filtered data in table
    function renderTable() {
        filteredData.forEach(function(sighting) {
            var tableRow = d3.select("tbody").append("tr");
            Object.entries(sighting).forEach(function([key,value]) {
                // console.log(key, value);
                var tableCell = d3.select("tbody").append("td");
                tableCell.text(value);
            });
        });
    }

    // prevent page from refreshing:
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    var inputDateElement = d3.select("#datetime");
    var inputCityElement = d3.select("#city");
    var inputStateElement = d3.select("#state");
    var inputCountryElement = d3.select("#country");
    var inputShapeElement = d3.select("#shape");

    var inputDateValue = inputDateElement.property("value");
    var inputCityValue = inputCityElement.property("value");
    var inputStateValue = inputStateElement.property("value");
    var inputCountryValue = inputCountryElement.property("value");
    var inputShapeValue = inputShapeElement.property("value");

    // select statements for filters

    // value in date, city/state/country, and shape
    if ((inputDateValue != ""  && inputShapeValue !="") && (inputCityValue != "" || inputStateValue != "" || inputCountryValue !="")) {
        var filteredData = tableData.filter(filterTable => ((filterTable.datetime === inputDateValue &&  filterTable.shape === inputShapeValue) && (filterTable.city === inputCityValue || filterTable.state === inputStateValue || filterTable.country === inputCountryValue)));
    }

    // value in date and city/state/country; no value in shape
    else if (inputDateValue != "" && (inputCityValue != "" || inputStateValue != "" || inputCountryValue !="") && inputShapeValue == "") {
        var filteredData = tableData.filter(filterTable => (filterTable.datetime === inputDateValue && (filterTable.city === inputCityValue || filterTable.state === inputStateValue || filterTable.country === inputCountryValue)));
    }

    // value in date and shape; no value in city/state/country
    else if ((inputDateValue != ""  && inputShapeValue !="") && (inputCityValue == "" || inputStateValue == "" || inputCountryValue =="")) {
        var filteredData = tableData.filter(filterTable => ((filterTable.datetime === inputDateValue &&  filterTable.shape === inputShapeValue)));
    }

    // value in city/state/country and shape; no value in date
    else if (inputDateValue == ""  && inputShapeValue !="" && (inputCityValue != "" || inputStateValue != "" || inputCountryValue !="")) {
        var filteredData = tableData.filter(filterTable => ((filterTable.city === inputCityValue || filterTable.state === inputStateValue || filterTable.country === inputCountryValue) &&  filterTable.shape === inputShapeValue));
    }

    // value in date; no value in city/state/country and shape
    else if (inputDateValue != ""  && inputShapeValue =="" && (inputCityValue == "" || inputStateValue == "" || inputCountryValue =="")) {
        var filteredData = tableData.filter(filterTable => filterTable.datetime === inputDateValue);
    }

    // value in city/state/country; no value in date and shape
    else if (inputDateValue == ""  && inputShapeValue =="" && (inputCityValue != "" || inputStateValue != "" || inputCountryValue !="")) {
        var filteredData = tableData.filter(filterTable => (filterTable.city === inputCityValue || filterTable.state === inputStateValue || filterTable.country === inputCountryValue));
    }

    // value in shape; no value in city/state/country and date
    else if (inputDateValue == ""  && inputShapeValue !="" && (inputCityValue == "" || inputStateValue == "" || inputCountryValue =="")) {
        var filteredData = tableData.filter(filterTable => filterTable.shape === inputShapeValue);
    }

    // Check filtered data in console
    console.log(filteredData);

    // Display table
    if (filteredData.length === 0) {
        var result = window.alert('No sighting is recorded');
    }
    else {
        renderTable();
    }
    
});

    // Creating a clear button to clear data in table (per the user's intention)
    var clearValues = d3.select("#reload-btn");
    var clearTable = d3.select("#clear-btn");
    var tableRow = d3.select("tbody");

    // Clear table and clear search values
    clearValues.on("click", function() {
        location.reload();
    })

    clearTable.on("click", function() {
        tableRow.html("");
    })