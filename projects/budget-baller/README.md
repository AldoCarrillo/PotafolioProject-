# BUDGET-BALLER-
[Link to the webPage](https://aldocarrillo.github.io/HW7-TheProject1/)

## About
Budget Baller is a site that allows you to manage your budget like a "Baller". Through the use of {{{API NAME HERE}}} and {{{API NAME HERE}}}

## Usage
The homepage is designed with the intention of showing a list of incomes, expenses, and remaining balance of income minus expenses. The navbar navigates between this page, the calendar and the budget page. The user can click on the add income button in the income card to display a modal, allowing you to report income in any of the accounts, updating the total for the corresponding account, total balance, and list of incomes. The same can be done in the expenses category, updating the balance display and list of expenses. The add an expense modal also allows you to categorize your expenses as a food, home, travel, car, or entertainment expense to be used in the budget page.

The budget page exists to give a clear display of the user's recorded expenses compared against a budget total set by the user. These expenses are grouped by the categories set when recording an expense and displayed as a series of progress bars, with zero percent being no recorded expenses in that category and one hunderd percent representing the user reaching or exceeding their monthly expenses for that category. The amount spent display is the sum total of all expenses recorded within a category and the budget total display is the limit set by the user. To set the budget, the user can click the add budgets button and set a limit for each category. The amount spent is automatically updated once an expense is recorded.

The calendar page displays a monthly calendar for the current year and will display all expenses and their future payments (if a payment is reccuring) to give an at a glance view of what and when a user can be expected to pay a bill on time. Each month accurately displays the number of days in the month and the corresponding day of the week. The calendar page also allows you to add future or past payments by clicking on a specific date in the calendar.

## Credit
This project was made in collaboration with:

- [Jeffrey Choi](https://github.com/jepoy92)
- [Aldo Carrillo](https://github.com/AldoCarrillo)
- [Jones Elliott](https://github.com/JonesElliott)
- [Ian Sachs](https://github.com/Iansachs1)
- [Daniel Beltran](https://github.com/danielbv92)

## Homepage


### Calendar
The calendar was built using Kim Heidorn's calendar as a guide through her explanation on [Dev.to/](https://dev.to/). The bare minimum of html was coded to make creating the calendar easier but the majority of it is generated through JavaScript using the built in ```Date()``` object.

[Kim Heidorn Calendar Walkthrough](https://dev.to/knheidorn/making-a-calendar-in-vanilla-javascript-48j8)

## License
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.