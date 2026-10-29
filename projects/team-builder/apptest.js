const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");
var inquirer = require("inquirer");
const { async } = require("rxjs");

var qustionesManager = [
  {
    name: "name",
    message: "Manager's Name:",
  },
  {
    name: "email",
    message: "Manager's Email:",
  },
  {
    name: "office",
    message: "Manager's Office Number:",
  },
];

var questionesEngineer = [
  {
    name: "name",
    message: "Engineer Name:",
  },
  {
    name: "email",
    message: "Engineer Email:",
  },
  {
    name: "github",
    message: "Engineer  GitHub:",
  },
];

var questionesIntern = [
  {
    name: "name",
    message: "Intern Name:",
  },
  {
    name: "email",
    message: "Intern Email:",
  },
  {
    name: "school",
    message: "Intern  School:",
  },
];

var howmanyIngineers = [
  {
    name: "quantity",
    message: "How many Ingenieers?",
  },
];

var howManyInterns = [
  {
    name: "quantity",
    message: "How many Interns?",
  },
];

const arrayManagers = [];
const arrayEngineers = [];
const arrayInterns = [];

inquirer
  .prompt(qustionesManager, async function (response) {
    const newManager = new Manager(
      response.name,
      1,
      response.email,
      response.office
    );
    arrayManagers.push(newManager);
  })
  .then(async function (response) {
    await inquirer
      .prompt(questionesEngineer, async function (response) {
        const newEngineer = new Engineer(
          response.name,
          1,
          response.email,
          response.github
        );
        arrayEngineers.push(newEngineer);
      })
      .then(async function (response) {
        await inquirer.prompt(questionesIntern, async function (response) {
          const newIntern = new Intern(
            response.name,
            1,
            response.email,
            response.school
          );
          arrayInterns.push(newIntern);
        });
      });
  });

console.log(arrayManagers);
console.log(arrayEngineers);
console.log(arrayInterns);
