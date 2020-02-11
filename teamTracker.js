require('dotenv').config()
const mysql = require("mysql");
const inquirer = require("inquirer");

// database access configuration
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "tracker_db"
});

// establish connection with database
connection.connect(err => {
    if (err) throw err;
    startApp();
});

// function to query user
function startApp() {
    inquirer.prompt({
        name: "request",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Roles",
            "View All Roles",
            "Add Roles",
            "View All Departments",
            "Add department",
        ]
    }).then(answer => {
        switch (answer.request) {
            case "View All Employees":
                allEmployess();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Update Employee Roles":
                updateEmpRole();
                break;

            case "View All Roles":
                allRoles();
                break;

            case "Add Roles":
                addRole();
                break;

            case "View All Departments":
                allDepartments();
                break;

            case "Add department":
                addDepartment();
                break;
        };
    });
};

// view all employees
function allEmployess() {
    console.log("Viewing Employess!!!");

    // query user again
    startApp();
};

// add an employee
function addEmployee() {
    console.log("Adding Employee...");

    // query user again
    startApp();
};

// update the role of employee
function updateEmpRole() {
    console.log("Updating employee roles...");

    // query user again
    startApp();
};

// view all roles
function allRoles() {
    console.log("Viewing Roles!!!");

    // query user again
    startApp();
};

// add a role
function addRole() {
    console.log("Adding Role...");

    // query user again
    startApp();
};

// view all departments
function allDepartments() {
    console.log("Viewing All Departments!!!");

    // query user again
    startApp();
};

// add a department
function addDepartment() {
    console.log("Adding Department...");

    // query user again
    startApp();
};