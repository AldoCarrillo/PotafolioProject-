// load Total of budgets setted by the user
function loadTotalBudgets (){

    if(JSON.parse(localStorage.getItem("Storaged-Budgets"))){
        var StoragedBudgets = JSON.parse(localStorage.getItem("Storaged-Budgets"));
        console.log("vvvvvvvvvvvvv BUDGETS STORAGED vvvvvvvvvvvvvvvvvv");
        console.log(StoragedBudgets);


        var totalEntertainment = document.getElementById("total-entertainment");
        var totalTravel = document.getElementById("total-travel");
        var totalFood = document.getElementById("total-food");
        var totalHome = document.getElementById("total-home");
        var totalCar = document.getElementById("total-car");

        totalEntertainment.textContent = StoragedBudgets.entertainment;
        totalTravel.textContent = StoragedBudgets.travel;
        totalFood.textContent = StoragedBudgets.food;
        totalHome.textContent = StoragedBudgets.home;
        totalCar.textContent = StoragedBudgets.car;

    }
    else
        console.log("No total Budgets storaged");


}

//load the money spent already from index page
function loadSpentMoney(){
    var currentEntertainment = document.getElementById("current-entertainment");
    var currentTravel = document.getElementById("current-travel");
    var currentFood = document.getElementById("current-food");
    var currentHome = document.getElementById("current-home");
    var currentCar = document.getElementById("current-car");

    if(JSON.parse(localStorage.getItem("Storaged-Categories"))){
        var storedExpenses = JSON.parse(localStorage.getItem("Storaged-Categories"));


        console.log("vvvvvvvvvvv CATEGORIES EXPENSES vvvvvvvvvv");
        console.log(storedExpenses);

        currentEntertainment.textContent = storedExpenses.entertainment + " $";
        currentTravel.textContent = storedExpenses.travel+ " $";
        currentFood.textContent = storedExpenses.food+ " $";
        currentHome.textContent = storedExpenses.home+ " $";
        currentCar.textContent = storedExpenses.car+ " $";




    }
    else
        console.log("Not Expenses for budgets Storaged");


}

//calcualte the porcentage for the progressbars
function calcProgressBar(amount,budget){

    var porcentage = 0;
    porcentage = parseInt(amount) /parseInt( budget) *100;


    return porcentage;

}

//gets the budgets and expenses to calculate the progress
function calculateBudgets(){

    var currentEntertainment = document.getElementById("current-entertainment");
    var currentTravel = document.getElementById("current-travel");
    var currentFood = document.getElementById("current-food");
    var currentHome = document.getElementById("current-home");
    var currentCar = document.getElementById("current-car");

    var totalEntertainment = document.getElementById("total-entertainment");
    var totalTravel = document.getElementById("total-travel");
    var totalFood = document.getElementById("total-food");
    var totalHome = document.getElementById("total-home");
    var totalCar = document.getElementById("total-car");

    var EntertainmentBar = document.getElementById("entertainment-bar");
    var TravelBar = document.getElementById("travel-bar");
    var FoodBar = document.getElementById("food-bar");
    var HomeBar = document.getElementById("home-bar");
    var CarBar = document.getElementById("car-bar");


    EntertainmentBar.setAttribute("value",calcProgressBar(currentEntertainment.textContent,totalEntertainment.textContent));
    TravelBar.setAttribute("value",calcProgressBar(currentTravel.textContent,totalTravel.textContent));
    FoodBar.setAttribute("value",calcProgressBar(currentFood.textContent,totalFood.textContent));
    HomeBar.setAttribute("value",calcProgressBar(currentHome.textContent,totalHome.textContent));
    CarBar.setAttribute("value",calcProgressBar(currentCar.textContent,totalCar.textContent));

    $("#porcentage-Entertainment").text(calcProgressBar(currentEntertainment.textContent,totalEntertainment.textContent) + " %");
    $("#porcentage-Travel").text(calcProgressBar(currentTravel.textContent,totalTravel.textContent)+ " %");
    $("#porcentage-Food").text(calcProgressBar(currentFood.textContent,totalFood.textContent)+ " %");
    $("#porcentage-Home").text(calcProgressBar(currentHome.textContent,totalHome.textContent)+ " %");
    $("#porcentage-Car").text(calcProgressBar(currentCar.textContent,totalCar.textContent)+ " %");


}


//set local storgae the budgets form the modal
function storageBudgets(newfood,newtravel,newhome,newcar,newentertainment){

    if(JSON.parse(localStorage.getItem("Storaged-Budgets")))
        var storagedBudgets = JSON.parse(localStorage.getItem("Storaged-Budgets"));
    else{
        var storagedBudgets = {
            food :0,
            travel: 0,
            home: 0,
            car: 0,
            entertainment : 0
        };

    }

    var BudgetElement = {
        food :newfood,
        travel: newtravel,
        home: newhome,
        car: newcar,
        entertainment : newentertainment
    };

    storagedBudgets = BudgetElement;
    localStorage.setItem("Storaged-Budgets", JSON.stringify(storagedBudgets));

    console.log(storagedBudgets);

}

// empty the modal window
function clearModal3(){

    $("#budget-food").val("");
    $("#budget-travel").val("");
    $("#budget-home").val("");
    $("#budget-car").val("");
    $("#budget-entertainment").val("");

    $("#modal3").addClass("modal-display");

}

loadTotalBudgets();
loadSpentMoney();
calculateBudgets();


//button to add the budgets
$("#Budget-Button").click( function(event){
    $("#modal3").toggleClass("modal-display");

});

//button summit for the modal
$("#modal3-button-submit").click( function(event){

    var totalEntertainment = document.getElementById("total-entertainment");
    var totalTravel = document.getElementById("total-travel");
    var totalFood = document.getElementById("total-food");
    var totalHome = document.getElementById("total-home");
    var totalCar = document.getElementById("total-car");

    totalEntertainment.textContent = $("#budget-entertainment").val();
    totalTravel.textContent = $("#budget-travel").val();
    totalFood.textContent = $("#budget-food").val();
    totalHome.textContent = $("#budget-home").val();
    totalCar.textContent = $("#budget-car").val();

    storageBudgets($("#budget-food").val(),$("#budget-travel").val(),$("#budget-home").val(),$("#budget-car").val(),$("#budget-entertainment").val());

    clearModal3();
    calculateBudgets();

});

// button cancel for the modal
$("#modal3-button-cancel").click( function(event){

    clearModal3();

});