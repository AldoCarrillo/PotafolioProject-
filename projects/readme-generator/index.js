var inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");


const writeFileAsync = util.promisify(fs.writeFile);


function readmeOutput(answers,lincenseText){

    const title = answers.title;
    const description = answers.description;
    const installation = answers.installation;
    const usage = answers.usage;
    const credits = answers.credits;
    const test = answers.test;
    const email = answers.email;
    const username = answers.username;
    const license = answers.license;
    const text = lincenseText;

    return `

# ${title}       ${license}

## Description
${description}

## Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)


## Installation
${installation}

## Usage
 ${usage}

## Test
${test}

## Credits
${credits}



## License
${text}

## Questiones

* GitHub link: https://github.com/${username}
* Email: ${email}

`;

}


inquirer
  .prompt([
    {
        name: "title",
        message: "Title of the README?"
    },
    {
        name: "description",
        message: "Enter Description of the README"

    },
    {
        name: "installation",
        message: "Installation Instructions?"

    },
    {
        name: "usage",
        message: "Usage Information?"

    },
    {
        name: "credits",
        message: "Credits for: "

    },
    {
        name: "test",
        message: "Write here instruction for a Test: "

    },
    {
        name: "license",
        message: "What type of License? 1)MIT 2)BDS 3)GPL"

    },
    {
        name: "name",
        message: "Your Name:"

    },
    {
        name: "year",
        message: "What Year:"

    },
    {
        name: "email",
        message: "For Questiones enter your Email:"

    },
    {
        name: "username",
        message: "For Questiones enter your  GitHub Username:"

    }
  ])
  .then(function(response) {

    var license = require("./licenses.js");
    var licenseText = license.getLicenseText(response.license,response.name,response.year);

    response.license = license.getLicenseBadge(response.license);

    return readmeOutput(response,licenseText);

  })
  .then(function(readme){
    return writeFileAsync('./ReadMEOutput.md', readme);
})
.then(function () {
    console.log(' \n ****README Generated!****');
});
