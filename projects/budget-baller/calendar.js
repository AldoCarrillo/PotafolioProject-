// This section builds the calendar using for loops creating a table
// Set current year and month to variables
var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth();
var currentDay = new Date().getDate()

// Function to build the calendar
function renderCalendar(year, month) {
  // Using Date() to calculate date information to display on the calendar
  let startOfMonth = new Date(year, month).getDay();
  let numOfDays = 32 - new Date(year, month, 32).getDate();
  let renderNum = 1;

  // Retrieve HTML elements to write to
  let tableBody = document.getElementById("table-body");
  let renderMonth = document.getElementById("month");
  let renderYear = document.getElementById("year");

  // Formats the current month into a String to be written at the top of the calendar. Ex: 7 === Augsut
  const today = new Date(currentYear, currentMonth);
  const monthString = today.toLocaleString("default", { month: "long" });

  renderMonth.textContent = monthString;
  renderYear.textContent = year;

  // Loop through to create the rows (weeks) of the calendar
  for (i = 0; i < 6; i++) {
    let row = document.createElement("tr");

    // Loop through to create each day of the week
    for (j = 0; j < 7; j++) {

      // Loop to check what day of the week the first day of the month starts
      // Creates empty days prior to creating the first day of the month
      if (i === 0 && j < startOfMonth) {
        let td = document.createElement("td");
        td.classList.add("empty");
        td.classList.add("calendar-table-data");
        row.append(td);

        // If the last day of the month has been written then break out of the loop
      } else if (renderNum > numOfDays) {
        break;

        // Write the actual days of the month
      } else {
        // This will be the "box" for each day
        let td = document.createElement("td");
        td.setAttribute("id", renderNum);
        td.setAttribute("class", "calendar-table-data");

        if (renderNum < currentDay) {
          td.setAttribute('style', 'border: 2px solid black; width: 150px; height: 100px; padding-left: 5px; padding-top: 5px; font-weight:bold; background-color: lightgrey; opacity: 75%;');
        } else if (renderNum === currentDay) {
          td.setAttribute('style', 'border: 2px solid black; width: 150px; height: 100px; padding-left: 5px; padding-top: 5px; font-weight:bold; background-color: lightgreen;');
        } else if (renderNum > currentDay) {
          td.setAttribute('style', 'border: 2px solid black; width: 150px; height: 100px; padding-left: 5px; padding-top: 5px; font-weight:bold; background-color: lightblue;');
        }

        // This will hold the date of each day
        let pTag = document.createElement("p");
        pTag.textContent = renderNum;
        pTag.setAttribute("class", "calendar-ptag");

        row.append(td);
        td.append(pTag);
        renderNum++;
      }
    }
    // Append constructed rows to the table element
    tableBody.append(row);
  }
}

// Call function to build calendar based on given month and year
renderCalendar(currentYear, currentMonth);

// Button functionality to go to previous month
$("#previous-month").on("click", function () {
  var prevMonth = new Date().getMonth();
  currentMonth--;
  clearCalendar();
  renderCalendar(currentYear, currentMonth);
  if (prevMonth === currentMonth) {
    loadExpenses();
  }
});

// Button functionality to go to next month
$("#next-month").on("click", function () {
  var nextMonth = new Date().getMonth();
  currentMonth++;
  clearCalendar();
  renderCalendar(currentYear, currentMonth);
  if (nextMonth === currentMonth) {
    loadExpenses();
  }
});

// Clear the calendar
function clearCalendar() {
  const tableBody = $('#table-body');
  tableBody.empty();
}

// Load expenses from local storage
function loadExpenses() {
  if(JSON.parse(localStorage.getItem("Storaged-Expenses"))){
      var StoragedExpenses = JSON.parse(localStorage.getItem("Storaged-Expenses"));

      StoragedExpenses.forEach(element => {
          var newDate = moment(element.date).format('DD');
          var newName = element.name;
          var newAmount = element.amount;

          var newText = document.createElement('p');
          newText.textContent = (" " + newName + " $" + newAmount);
          newText.setAttribute('id', "p" + newDate);

          $('#' + parseInt(newDate)).append(newText);
      });
  }
  else
      console.log("No Stored Data");
}

// Load Expenses when page is loaded
loadExpenses();

// Function to save expenses to lcoal storage
function SetExpense(expense){

  if(JSON.parse(localStorage.getItem("Storaged-Expenses")))
      var ExpensesList = JSON.parse(localStorage.getItem("Storaged-Expenses"));
  else
      var ExpensesList = [];


  ExpensesList.push(expense);
  localStorage.setItem("Storaged-Expenses", JSON.stringify(ExpensesList));

  clearCalendar();
  renderCalendar(currentYear, currentMonth);
  loadExpenses();
}

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

// Event listener for calendar date click
// Load modal and get user information
$("td").on("click", function (event) {
  var paymentDate = $(this)[0].firstChild.textContent;
  var selectedDayElement = document.getElementById(paymentDate);

  // This will change the modal from hidden to display
  $("#modal").toggleClass("modal-display");

  // Submit information
  $("#modal-button-submit").on("click", function (event) {
    event.preventDefault();
    getModalInformation(selectedDayElement, paymentDate);
    clearModal(selectedDayElement, paymentDate);
  });

  // Cancel modal
  $("#modal-button-cancel").on("click", function (event) {
    event.preventDefault();
    clearModal(selectedDayElement, paymentDate);
  });
});

// Get info from modal
function getModalInformation(selectedDayElement, paymentDate) {
  var ExpenseName = $("#expense-name").val();
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
  // Remember to remove and fix this later!!!!!!!!
  var ExpenseDate = "08/" + paymentDate + "/2020";

  const newExpense = new Expense(ExpenseDate,ExpensePlace,ExpenseName,ExpenseAmount,ExpenseCategory,ExpenseFrecuency);

  // ClearExpenses(paymentDate);
  SetExpense(newExpense);
  clearModal();
}

// Clear modal on close
function clearModal(selectedDayElement, paymentDate) {
  // This will change the modal to hidden
  paymentDate = "";
  selectedDayElement = "";
  document.getElementById("bank-radio").checked = false;
  document.getElementById("card-radio").checked = false;
  document.getElementById("cash-radio").checked = false;
  $("#modal").addClass("modal-display");
  $("#expense-name").val("");
  $("#expense-amount").val("");
  $("#select-frequency").val("weekly");
  $("#select-category").val("entertainment");
}
