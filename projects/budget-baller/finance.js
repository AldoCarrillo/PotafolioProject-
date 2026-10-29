

//Send the request to API to Get the BANK info
function loadBankInfo(){

    var BankBalance  = document.getElementById("Bank-Amount");
    var CardBalance = document.getElementById("Card-Amount");

    $.ajax({
        url: "https://ws.adanta.mx/api/Customer/Account/22",
        type: 'GET',
        dataType: 'json',
        success: function (Customer) {

            console.log("vvvvvvvvvvvvv BANK INFO vvvvvvvvvvvvvv");
            console.log(Customer);

            //set bank balance
            BankBalance.textContent = Customer.balance ;
           //set card balance
            CardBalance.textContent = Customer.card;

            loadExpenses();
            loadIncomes();
            loadBalance();

        }
    });

}

//Load CASH form Local storage
function loadInfoCash(){

    var CashBalance = document.getElementById("Cash-Amount");

    if(JSON.parse(localStorage.getItem("Cash-Storaged"))){
        var storedCash = JSON.parse(localStorage.getItem("Cash-Storaged"));
        CashBalance.textContent = storedCash;
    }
    else
        console.log("not storage");
}

//Calculate the balance
function loadBalance(){
    var balance = document.getElementById("Balance-Amount");
    var allbalances = parseInt( $("#Bank-Amount").text());
            allbalances+= parseInt( $("#Card-Amount").text());
                allbalances+= parseInt( $("#Cash-Amount").text());

    balance.textContent = allbalances;

}

//Saves CASH to local storage
function SetCashStorage(cashToSave){

    if(JSON.parse(localStorage.getItem("Cash-Storaged")))
        var cash = JSON.parse(localStorage.getItem("Cash-Storaged"));
    else
        var cash = 0;

    cash= cashToSave;
    localStorage.setItem("Cash-Storaged", JSON.stringify(cash));

}


//Load all the money sources from API and local Storage
function loadMoneyInfo(){

    loadBankInfo();
    loadInfoCash();

    loadBalance();

}

// Substract EXPENSES from Balance
function SubsFromBalance(TotalBank,TotalCard,TotalCash){

    $("#Bank-Amount").text($("#Bank-Amount").text()-TotalBank);
    $("#Card-Amount").text($("#Card-Amount").text()-TotalCard);
    $("#Cash-Amount").text($("#Cash-Amount").text()-TotalCash);

    loadBalance();
}


// Add INCOMES to balance
function AddToBalance(TotalBank,TotalCard,TotalCash){

    $("#Bank-Amount").text(parseInt( $("#Bank-Amount").text()) +TotalBank);
    $("#Card-Amount").text(parseInt( $("#Card-Amount").text()) +TotalCard);
    $("#Cash-Amount").text(parseInt( $("#Cash-Amount").text()) +TotalCash);

    loadBalance();
}


// Clear the INCOMES list
function ClearIncomes(){
    var IncomeList = document.getElementById("Incomes-List");
        IncomeList.innerHTML = "";

}


// Load the INCOMES list
function loadIncomes(){

    var TotalBank = 0;
    var TotalCard = 0;
    var TotalCash =0;

    ClearIncomes();

    if(JSON.parse(localStorage.getItem("Storaged-Incomes"))){
        var StoragedIncomes = JSON.parse(localStorage.getItem("Storaged-Incomes"));
        console.log("vvvvvvvvvvvvv INCOMES STORAGED vvvvvvvvvvvvvvvvvv");
        console.log(StoragedIncomes);

        StoragedIncomes.forEach(element => {

            var IncomeList = document.getElementById("Incomes-List");

            var IncomeElement = document.createElement("tr");

            var IncomeDate = document.createElement("td");
            IncomeDate.setAttribute("id","date");

            var IncomePlace  = document.createElement("td");
                IncomePlace.setAttribute("id","place");
            var PlaceImg = document.createElement("img");
            if(element.place == "bank"){
                PlaceImg.setAttribute("src","Assets/bank.png");
                PlaceImg.setAttribute("alt","icon of a bank");

            }
            else if(element.place == "card"){
                PlaceImg.setAttribute("src","Assets/credit-card.png");
                PlaceImg.setAttribute("alt","icon of a card");
            }
            else if(element.place == "cash"){
                PlaceImg.setAttribute("src","Assets/cash.png");
                PlaceImg.setAttribute("alt","icon of a bill");
            }

            IncomePlace.append(PlaceImg);

            var IncomeName = document.createElement("td");
            IncomeName.setAttribute("id","name");

            var IncomeAmount = document.createElement("td");
            IncomeAmount.setAttribute("id","amount");
            var AmountImg = document.createElement("img");

            AmountImg.setAttribute("src","Assets/DOLLA-DOLLA-BILLS.png");
            AmountImg.setAttribute("alt","icon of dollar");

            IncomeDate.textContent = element.date;
            IncomeName.textContent = element.name;
            IncomeAmount.textContent = element.amount;
            IncomeAmount.prepend(AmountImg);

            IncomeElement.appendChild(IncomeDate);
            IncomeElement.appendChild(IncomePlace);
            IncomeElement.appendChild(IncomeName);
            IncomeElement.appendChild(IncomeAmount);

            IncomeList.prepend(IncomeElement);

            switch (element.place) {
                case "bank":
                    TotalBank += parseInt(element.amount);
                    break;

                case "card":
                    TotalCard += parseInt(element.amount);
                    break;

                case "cash":
                    TotalCash += parseInt(element.amount);
                    break;

                default:
                    break;
            }

        });

        AddToBalance(TotalBank,TotalCard,TotalCash);

    }

    else
        console.log("No INCOMES storaged");

}


// Clear the EXPENSES list
function ClearExpenses(){
    var ExpensesList = document.getElementById("Expenses-List");
        ExpensesList.innerHTML = "";
}


//Load the EXPENSES list
function loadExpenses() {

    var TotalBank = 0;
    var TotalCard = 0;
    var TotalCash =0;

    ClearExpenses();

    if(JSON.parse(localStorage.getItem("Storaged-Expenses"))){
        var StoragedExpenses = JSON.parse(localStorage.getItem("Storaged-Expenses"));

        console.log("vvvvvvvvvvvvv EXPENSES STORAGED vvvvvvvvvvvvvvvvv");
        console.log(StoragedExpenses);

        StoragedExpenses.forEach(element => {

            var ExpenseList = document.getElementById("Expenses-List");

            var ExpenseElement = document.createElement("tr");

            var ExpenseDate = document.createElement("td");
            ExpenseDate.setAttribute("id","date");

            var ExpensePlace  = document.createElement("td");
                ExpensePlace.setAttribute("id","place");
            var PlaceImg = document.createElement("img");
            if(element.place == "bank"){
                PlaceImg.setAttribute("src","Assets/bank.png");
                PlaceImg.setAttribute("alt","icon of a bank");

            }
            else if(element.place == "card"){
                PlaceImg.setAttribute("src","Assets/credit-card.png");
                PlaceImg.setAttribute("alt","icon of a card");

            }
            else if(element.place == "cash"){
                PlaceImg.setAttribute("src","Assets/cash.png");
                PlaceImg.setAttribute("alt","icon of a bill");

            }

            ExpensePlace.append(PlaceImg);

            var ExpenseName = document.createElement("td");
            ExpenseName.setAttribute("id","name");

            var ExpenseAmount = document.createElement("td");
            ExpenseAmount.setAttribute("id","amount");
            var AmountImg = document.createElement("img");

            AmountImg.setAttribute("src","Assets/DOLLA-DOLLA-BILLS.png");
            AmountImg.setAttribute("alt","icon of dollar");

            var ExpenseCategory = document.createElement("td");
            ExpenseCategory.setAttribute("id","category");

            ExpenseDate.textContent = element.date;
            ExpenseName.textContent = element.name;
            ExpenseAmount.textContent = element.amount;
            ExpenseAmount.prepend(AmountImg);
            ExpenseCategory.textContent = element.category;

            ExpenseElement.appendChild(ExpenseDate);
            ExpenseElement.appendChild(ExpensePlace);
            ExpenseElement.appendChild(ExpenseName);
            ExpenseElement.appendChild(ExpenseAmount);
            ExpenseElement.appendChild(ExpenseCategory);

            ExpenseList.prepend(ExpenseElement);


            switch (element.place) {
                case "bank":
                    TotalBank += parseInt(element.amount);
                    break;

                case "card":
                    TotalCard += parseInt(element.amount);
                    break;

                case "cash":
                    TotalCash += parseInt(element.amount);
                    break;

                default:
                    break;
            }

        });

        SubsFromBalance(TotalBank,TotalCard,TotalCash);

    }

    else
        console.log("No EXPENSES storaged");

    SetCatergories();

}

//Save EXPENSE in local Storage
function SetExpense(expense){

    if(JSON.parse(localStorage.getItem("Storaged-Expenses")))
        var ExpensesList = JSON.parse(localStorage.getItem("Storaged-Expenses"));
    else
        var ExpensesList = [];

    ExpensesList.push(expense);
    localStorage.setItem("Storaged-Expenses", JSON.stringify(ExpensesList));

    loadMoneyInfo();

}


//Save INCOME in Local Storage
function SetIncome(income){

    if(JSON.parse(localStorage.getItem("Storaged-Incomes")))
        var IncomesList = JSON.parse(localStorage.getItem("Storaged-Incomes"));
    else
        var IncomesList = [];

    IncomesList.push(income);
    localStorage.setItem("Storaged-Incomes", JSON.stringify(IncomesList));

    loadMoneyInfo();

}



//Clear Modal Expense
function clearModal(){

    $("#expense-name").val("");
    $("#expense-amount").val("");
    $("#select-frequency").val("Once");
    $("#select-category").val("Food");

    document.getElementById("bank-radio").checked = false;
    document.getElementById("card-radio").checked = false;
    document.getElementById("cash-radio").checked = false;

    $("#modal").addClass("modal-display");

}


//Clear Modal Income
function clearModal2(){

    $("#income-name").val("");
    $("#income-amount").val("");
    $("#select-frequency").val("Once");

    document.getElementById("bank-radio-income").checked = false;
    document.getElementById("card-radio-income").checked = false;
    document.getElementById("cash-radio-income").checked = false;

    $("#modal2").addClass("modal-display");

}


//Set Categories Local Storaged
function SetCatergories(){
    var TotalFood = 0;
    var TotalTravel =0
    var TotalEntertainment = 0;
    var TotalBill =0;
    var TotalCar = 0;
    var TotalHome = 0;

    if(JSON.parse(localStorage.getItem("Storaged-Expenses"))){
        var StoragedExpenses = JSON.parse(localStorage.getItem("Storaged-Expenses"));

        console.log("vvvvvvvvvvvvv Categorires Storaged vvvvvvvvvvvvvvvvv");


        StoragedExpenses.forEach(element => {

            switch (element.category) {
                case "Food":
                    TotalFood += parseInt(element.amount);
                    break;

                case "Travel":
                    TotalTravel += parseInt(element.amount);
                     break;

                case "Home":
                    TotalHome += parseInt(element.amount);
                    break;
                case "Car":
                    TotalCar += parseInt(element.amount);
                    break;
                case "Bill":
                    TotalBill += parseInt(element.amount);
                    break;
                case "Entertainment":
                    TotalEntertainment += parseInt(element.amount);
                    break;
                default:
                    break;
            }


        });



        if(JSON.parse(localStorage.getItem("Storaged-Categories")))
            var StoragedCategories = JSON.parse(localStorage.getItem("Storaged-Categories"));
        else{
            var StoragedCategories = {
                food :0,
                travel: 0,
                home: 0,
                car: 0,
                bill: 0,
                entertainment : 0
            };
        }


        var categoryElement = {
            food :TotalFood,
            travel: TotalTravel,
            home: TotalHome,
            car: TotalCar,
            bill: TotalBill,
            entertainment : TotalEntertainment
        };


        StoragedCategories = categoryElement;
        localStorage.setItem("Storaged-Categories", JSON.stringify(StoragedCategories));

        console.log(StoragedCategories);



        }
    else
        console.log("No CATEGORIES Storaged");



}


/* Program Starts Here */
//demo cash storage
SetCashStorage("700");

//load the money info from differents sources
loadMoneyInfo();


//Button add Expense
$("#Add-Expense").click( function(event){
    $("#modal").toggleClass("modal-display");

});


//Button add Income
$("#Add-Income").click( function(event){
    $("#modal2").toggleClass("modal-display");

});


//Class for Expense Format
class Expense {
    constructor(date, place, name, amount,  category ,frecuency) {
        this.date = date;
        this.place = place;
        this.name = name;
        this.amount = amount;
        this.category = category;
        this.frecuency = frecuency;
    }

    info() {
      console.log(this);
    };

}

// Modal Expense- Summit Button
$("#modal-button-submit").click( function(event){
    var ExpenseDate = moment().format("MM/DD/YYYY");
    var ExpenseName  = $("#expense-name").val();
    var ExpenseAmount = $("#expense-amount").val();
    var ExpenseFrecuency = $("#select-frequency").val();
    var ExpenseCategory = $("#select-category").val();

    var ExpensePlace= "";
    if(document.getElementById("bank-radio").checked == true)
        ExpensePlace = "bank";
    if(document.getElementById("card-radio").checked == true)
        ExpensePlace = "card";
    if(document.getElementById("cash-radio").checked == true)
        ExpensePlace = "cash";


    const newExpense = new Expense(ExpenseDate,ExpensePlace ,ExpenseName,ExpenseAmount,ExpenseCategory,ExpenseFrecuency);
    SetExpense(newExpense);

    clearModal();


});


// Modal Expense- Cancel Button
$("#modal-button-cancel").click( function(event){

    clearModal();

});


// Class For Income Format
class Income {
    constructor(date, place, name, amount ,frecuency) {
        this.date = date;
        this.place = place;
        this.name = name;
        this.amount = amount;
        this.frecuency = frecuency;
    }

    info() {
      console.log(this);
    };


}


// Modal Income- Summit Button
$("#modal2-button-submit").click( function(event){

    var IncomeDate = moment().format("MM/DD/YYYY");
    var IncomeName  = $("#income-name").val();
    var IncomeAmount = $("#income-amount").val();
    var IncomeFrecuency = $("#income-frequency").val();

    var IncomePlace= "";
    if(document.getElementById("bank-radio-income").checked == true)
        IncomePlace = "bank";
    if(document.getElementById("card-radio-income").checked == true)
        IncomePlace = "card";
    if(document.getElementById("cash-radio-income").checked == true)
        IncomePlace = "cash";

    const newIncome = new Income(IncomeDate,IncomePlace ,IncomeName,IncomeAmount,IncomeFrecuency);
    SetIncome(newIncome);

    clearModal2();



});

// Modal Income- Cancel Button
$("#modal2-button-cancel").click( function(event){

    clearModal2();

});
