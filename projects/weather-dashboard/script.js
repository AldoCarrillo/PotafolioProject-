/*Function load the cities form locar storage or uptade the list */
function loadCities(){

    if(JSON.parse(localStorage.getItem("cities"))){
        var storedCities = JSON.parse(localStorage.getItem("cities"));
        var cities = document.getElementById("cities-ul");
        cities.innerHTML ="";
        console.log(storedCities);

        for (let index = 0; index < storedCities.length; index++) {
            var city = document.createElement("li");
            city.setAttribute("id",index);
            city.textContent = storedCities[index];
            cities.prepend(city);

        }

    }

    else
        console.log("not storaged");

}

/* Function set the local storage for the current city */
function setCities(city){

    if(JSON.parse(localStorage.getItem("cities")))
        var cities = JSON.parse(localStorage.getItem("cities"));
    else
        var cities = [];

    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    loadCities();

}

/* set uv index and change the color */
function loadUVindex(uv){

    $("#city-uv").text(uv);
    uv = parseInt(uv);

    switch (uv) {
        case 0:
        case 1:
        case 2:
            document.getElementById("city-uv").setAttribute("style","background-color: green;");
            break;
        case 3:
        case 4:
        case 5:
            document.getElementById("city-uv").setAttribute("style","background-color: yellow;");
            break;
        case 6:
        case 7:
            document.getElementById("city-uv").setAttribute("style","background-color: orange;");
            break;
        case 8:
        case 9:
        case 10:
            document.getElementById("city-uv").setAttribute("style","background-color: red;");
            break;
        case 11:
        default:
            document.getElementById("city-uv").setAttribute("style","background-color: purple;");
            break;
    }

/*
    if (uv<=2.99)
        document.getElementById("city-uv").setAttribute("style","background-color: green;");
    else if (uv>=3 && uv<=5.99)
        document.getElementById("city-uv").setAttribute("style","background-color: yellow;");
    else if (uv>=6 && uv<=7.99)
        document.getElementById("city-uv").setAttribute("style","background-color: orange;");
    else if (uv>=8 && uv<=10.99)
        document.getElementById("city-uv").setAttribute("style","background-color: red;");
    else if (uv>=11)
        document.getElementById("city-uv").setAttribute("style","background-color: purple;");

    */
}




/* display all the info in the corresponding fields */
function loadInfo(name,temperature,humidity,wind){

    var year = moment().format("/YYYY");
    var month = moment().format("MM/");
    var day = moment().format("DD");

    $("#bigdate").text("["+month+day+ year+"]");
    $("#city-name").text(name);

    temperature = KelvintoFar(temperature);
    temperature = Math.round(temperature*100)/100;
    $("#city-temperature").text(temperature + " F");
    $("#city-humidity").text(humidity + " %");
    $("#city-wind").text(wind + " mph");

}

/* display the 5 days forecast info  */
function loadForecast(fore1,fore2,fore3,fore4,fore5){

    var year = moment().format("/YYYY");
    var month = moment().format("MM/");
    var day = moment().format("DD");

    $("#date1").text(month + (parseInt(day)+1) + year);
    $("#date2").text(month + (parseInt(day)+2) + year);
    $("#date3").text(month + (parseInt(day)+3) + year);
    $("#date4").text(month + (parseInt(day)+4) + year);
    $("#date5").text(month + (parseInt(day)+5) + year);

    $("#temp1").text(KelvintoFar(fore1.main.temp) +" F");
    $("#temp2").text(KelvintoFar(fore2.main.temp) +" F");
    $("#temp3").text(KelvintoFar(fore3.main.temp) +" F");
    $("#temp4").text(KelvintoFar(fore4.main.temp) +" F");
    $("#temp5").text(KelvintoFar(fore5.main.temp) +" F");

    $("#humi1").text(fore1.main.humidity +" %");
    $("#humi2").text(fore2.main.humidity +" %");
    $("#humi3").text(fore3.main.humidity +" %");
    $("#humi4").text(fore4.main.humidity +" %");
    $("#humi5").text(fore5.main.humidity +" %");

}

/* display the 5 icons for the 5days forecast */
function setImages(img1,img2,img3,img4,img5){

    document.getElementById("img1").setAttribute("src","http://openweathermap.org/img/wn/"+img1+"@2x.png");
    document.getElementById("city-icon").setAttribute("src","http://openweathermap.org/img/wn/"+img1+"@2x.png");
    document.getElementById("city-icon").setAttribute("style","height: 65px; width: 65px;");
    document.getElementById("img2").setAttribute("src","http://openweathermap.org/img/wn/"+img2+"@2x.png");
    document.getElementById("img3").setAttribute("src","http://openweathermap.org/img/wn/"+img3+"@2x.png");
    document.getElementById("img4").setAttribute("src","http://openweathermap.org/img/wn/"+img4+"@2x.png");
    document.getElementById("img5").setAttribute("src","http://openweathermap.org/img/wn/"+img5+"@2x.png");

}

/* math function to convert kelvin to farenheit */
function KelvintoFar(kelvin){
    var farenheit = (kelvin -273.15) * 9/5 +32
    return Math.round(farenheit*100)/100;

}

/*Main Fucntion starts the program */
loadCities();


/* set the city clicked on the textbox to be searched again */
$("#cities-ul").click(function(event){
    var element = event.target;
    var textBoxCity = document.getElementById(element.id);
    $("#city-text").val(textBoxCity.textContent);

});

/* clear button to empty all the info */
$("#city-clear").click(function(event){
    $("#city-text").val("");
    localStorage.clear();
    var cities = document.getElementById("cities-ul");
    cities.innerHTML ="";
    loadCities();

});



 /* button to request all the info to the API using ajax weather, uv, icons*/
$("#city-button").click(function(event){

    setCities($("#city-text").val());
    var namecity = $("#city-text").val();

    $("#city-text").val("");
    var lat, lon;
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + namecity +",Burundi&appid=" + APIKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {

        console.log(response);

        lat = response.coord.lat;
        lon = response.coord.lon;


        loadInfo(response.name,response.main.temp,response.main.humidity,response.wind.speed);


        //query uvindex
        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey + "&lat=" + lat +"&lon=" + lon;

        $.ajax({
            url: queryURL2,
            method: "GET",
        }).then(function (res) {
            console.log(res);
            var uvI = res.value;
           loadUVindex(uvI);
        });


     });


    queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + namecity+ "&appid=" + APIKey;

     $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {

        loadForecast(response.list[0],response.list[1],response.list[2],response.list[3],response.list[4]);
        setImages(response.list[0].weather[0].icon,response.list[1].weather[0].icon,response.list[2].weather[0].icon,response.list[3].weather[0].icon,response.list[4].weather[0].icon);

       });



});