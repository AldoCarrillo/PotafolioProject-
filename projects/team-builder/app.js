//Classes paths
const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");

const path = require("path");
const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./htmlRenderer");
const { log } = require("console");
const { async } = require("rxjs");

let teamId = 1;

//function to input Manager
async function EnterManager() {
  console.log("---------MANAGER----------");

  const managers = [];
  const managerResponse = await inquirer.prompt([
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
  ]);

  const newManager = new Manager(
    managerResponse.name,
    teamId++,
    managerResponse.email,
    managerResponse.office
  );

  managers.push(newManager);
  return managers;
}

//function to input Engineer
async function EnterEngineer() {
  console.log("---------ENGINEER----------");
  const engineers = [];
  const firstQuestionResponse = await inquirer.prompt([
    {
      name: "engineersCount",
      message: "How Many Engineers?:",
    },
  ]);

  for (let i = 1; i <= firstQuestionResponse.engineersCount; i++) {
    console.log(
      `Entering engineer #${i} of ${firstQuestionResponse.engineersCount}`
    );

    const response = await inquirer.prompt([
      {
        name: "name",
        message: "Name:",
      },
      {
        name: "email",
        message: "Engineer " + i + " Email: ",
      },
      {
        name: "github",
        message: "Engineer " + i + " GitHub: ",
      },
    ]);

    const engineer = new Engineer(
      response.name,
      teamId++,
      response.email,
      response.github
    );
    engineers.push(engineer);
  }

  return engineers;
}

//function to input  Interns

async function EnterInterns() {
  console.log("---------INTERN----------");
  const interns = [];
  const firstQuestionResponse = await inquirer.prompt([
    {
      name: "interntsCount",
      message: "How Many Interns?: ",
    },
  ]);

  for (let i = 1; i <= firstQuestionResponse.interntsCount; i++) {
    console.log(
      `Entering Intern #${i} of ${firstQuestionResponse.interntsCount}`
    );

    const response = await inquirer.prompt([
      {
        name: "name",
        message: "Name:",
      },
      {
        name: "email",
        message: "Intern " + i + " Email: ",
      },
      {
        name: "school",
        message: "Intern " + i + " School: ",
      },
    ]);

    const intern = new Intern(
      response.name,
      teamId++,
      response.email,
      response.school
    );
    interns.push(intern);
  }

  return interns;
}

// get the html file replace the variables form each object
function replacePlaceholders(template, placeholder, value) {
  const pattern = new RegExp("{{ " + placeholder + " }}", "gm");
  return template.replace(pattern, value);
}

//create team array with all html files manager engineers and interns
function createTeam(managers, engineers, interns) {
  var team = [];
  managers.forEach((element) => {
    team.push(element);
  });

  engineers.forEach((element) => {
    team.push(element);
  });

  interns.forEach((element) => {
    team.push(element);
  });

  return team.join("");
}

//create the html file with all members of the team
function writeHTMLFile(
  arrayManagersFiles,
  arrayEngineersFiles,
  arrayInternsFiles
) {
  var teamFile = fs.readFileSync("./templates/main.html", "utf8");
  var team = createTeam(
    arrayManagersFiles,
    arrayEngineersFiles,
    arrayInternsFiles
  );
  teamFile = replacePlaceholders(teamFile, "team", team);
  writeFileAsync("./output/team.html", teamFile);
  console.log(" \n ****TEAM CREATED!****");
}

async function renderTeam(arrayManagers, arrayEngineers, arrayInterns) {
  //html file with all manager engineers and interns
  const arrayManagersFiles = [];
  const arrayEngineersFiles = [];
  const arrayInternsFiles = [];

  //create a html file for each object
  arrayManagers.forEach((element) => {
    var managerFile = fs.readFileSync("./templates/manager.html", "utf8");
    managerFile = replacePlaceholders(managerFile, "name", element.getName());
    managerFile = replacePlaceholders(managerFile, "role", element.getRole());
    managerFile = replacePlaceholders(managerFile, "email", element.getEmail());
    managerFile = replacePlaceholders(managerFile, "id", element.getId());
    managerFile = replacePlaceholders(
      managerFile,
      "officeNumber",
      element.getOfficeNumber()
    );

    arrayManagersFiles.push(managerFile);
  });

  arrayEngineers.forEach((element) => {
    var engineerFile = fs.readFileSync("./templates/engineer.html", "utf8");
    engineerFile = replacePlaceholders(engineerFile, "name", element.getName());
    engineerFile = replacePlaceholders(engineerFile, "role", element.getRole());
    engineerFile = replacePlaceholders(
      engineerFile,
      "email",
      element.getEmail()
    );
    engineerFile = replacePlaceholders(engineerFile, "id", element.getId());
    engineerFile = replacePlaceholders(
      engineerFile,
      "github",
      element.getGithub()
    );

    arrayEngineersFiles.push(engineerFile);
  });

  arrayInterns.forEach((element) => {
    var internFile = fs.readFileSync("./templates/intern.html", "utf8");
    internFile = replacePlaceholders(internFile, "name", element.getName());
    internFile = replacePlaceholders(internFile, "role", element.getRole());
    internFile = replacePlaceholders(internFile, "email", element.getEmail());
    internFile = replacePlaceholders(internFile, "id", element.getId());
    internFile = replacePlaceholders(internFile, "school", element.getSchool());

    arrayInternsFiles.push(internFile);
  });

  //create final html file
  writeHTMLFile(arrayManagersFiles, arrayEngineersFiles, arrayInternsFiles);
}

//ask the user for each member of the team
(async function () {
  //array with manager engineer and intern objects
  console.log("*****Enter your TEAM MEMBERS *****");

  const arrayManagers = await EnterManager();
  const arrayEngineers = await EnterEngineer();
  const arrayInterns = await EnterInterns();

  await renderTeam(arrayManagers, arrayEngineers, arrayInterns);
})();
