const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

const team = [];

const managerSetup = [
    {
        type: "input",
        name: "name",
        message: "Enter manager's name:"
    },
    {
        type: "input",
        name: "email",
        message: "Enter manager's email:"
    },

    {
        type: "input",
        name: "officeNumber",
        message: "Enter manager's office number:"
    }
]

const employeeSetup = [
    {
        type: "input",
        name: "name",
        message: "Enter employee's name:"
    },
    {
        type: "input",
        name: "email",
        message: "Enter employee's email:"
    },

    {
        type: "list",
        name: "role",
        message: "Choose role:",
        choices:["engineer","intern"]
        
    },

    {
        when: input => {
            return input.role == "engineer"
        },
        type: "input",
        name: "github",
        message: "Enter your GitHub username:"
    },
    
    {
        when: input => {
            return input.role == "intern"
        },
        type: "input",
        name: "school",
        message: "Enter your school",
    },

    {
        type: "list",
        name: "newMember",
        message: "Do you want to add another team member?",
        choices: ["Yes","No"]
    }

]

function buildTeam() {
    inquirer.prompt(employeeSetup).then(employeeInfo => {
        if (employeeInfo.role == "engineer") {
            var newMember = new Engineer(employeeInfo.name, team.length +1, employeeInfo.email, employeeInfo.github);
        }
        else {
            var newMember = new Intern(employeeInfo.name, team.length +1, employeeInfo.email, employeeInfo.school);
        }
    team.push(newMember);
    if(employeeInfo.newMember === "Yes") {
        console.log(" ");
        buildTeam();
    }
    else{
        buildHtmlPage();
    }
    })
}

function buildHtmlPage() {
    let newFile = fs.readFileSync("./templates/main.html")
    fs.writeFileSync("./output/teamPage.html", newFile, function (err) {
        if (err) throw err;
    })

    console.log("Page generated!");

    for (member of team) {
        if (member.getRole() == "Manager") {
            buildCard("manager", member.getName(), member.getId(), member.getEmail(), "Office: " + member.getOfficeNumber());
        } else if (member.getRole() == "Engineer") {
            buildCard("engineer", member.getName(), member.getId(), member.getEmail(), "Github: " + member.getGitHub());
        } else if (member.getRole() == "Intern") {
            buildCard("intern", member.getName(), member.getId(), member.getEmail(), "School: " + member.getSchool());
        }
    }
    fs.appendFileSync("./output/teamPage.html", "</div></main></body></html>", function (err) {
        if (err) throw err;
    });
    console.log("Completed!")

}

function buildCard(memberType, name, id, email, propertyValue) {
    let data = fs.readFileSync(`./templates/${memberType}.html`, 'utf8')
    data = data.replace("nameHere", name);
    data = data.replace("idHere", `ID: ${id}`);
    data = data.replace("emailHere", `email: <a href="mailto:${email}">${email}</a>`);
    data = data.replace("propertyHere", propertyValue);
    fs.appendFileSync("./output/teamPage.html",data, err => {if (err) throw err;})
    console.log("Added Card");
}

function init() {
    inquirer.prompt(managerSetup).then(managerInfo =>{
        let teamManager = new Manager (managerInfo.name, 1, managerInfo.email, managerInfo.officeNumber);
        team.push(teamManager);
        console.log(" ");
        buildTeam();
    })
};

init();