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
            "Exit"
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
            case "Exit":
                connection.end();
        };
    });
};

// view all employees
function allEmployess() {
    // define query
    const query = "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name FROM employees INNER JOIN roles ON (employees.role_id = roles.id) INNER JOIN departments ON (roles.depart_id = departments.id)"

    // run query in mysql
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
    });

    // query user again
    startApp();
};

// add an employee
function addEmployee() {

    // grab roles
    connection.query("SELECT * FROM roles", (err, res) => {
        if (err) throw err;
        const rolesListRaw = res;
        const rolesList = [];

        rolesListRaw.forEach(role => {
            rolesList.push(role.title);
        })

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the empployee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices: rolesList
            }
        ])

            .then((answers) => {
                let roleID;
                const firstNameNew = answers.firstName;
                const lastNameNew = answers.lastName;

                // 
                for (let i=0; i < rolesListRaw.length; i++) {
                    if (answers.role === rolesListRaw[i].title) {
                        roleID = rolesListRaw[i].id;
                    }
                }

                // query to add user inputs into employees table
                let query = "INSERT INTO employees SET ?";

                connection.query(query, {
                    first_name: firstNameNew,
                    last_name: lastNameNew,
                    role_id: roleID
                }, (err, res) => {
                    if (err) throw err;

                    // console.table(res);
                    console.log("Adding employee...")

                    startApp();
                });
            })

    })
};

// update the role of employee
function updateEmpRole() {
    console.log("Updating employee roles...");

    // query user again
    startApp();
};

// view all roles
function allRoles() {
    // define query
    const query = "SELECT * FROM roles"

    // run query in mysql
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
    });

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
    // define query
    const query = "SELECT * FROM departments"

    // run query in mysql
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
    });

    // query user again
    startApp();
};

// add a department
function addDepartment() {
    console.log("Adding Department...");

    // query user again
    startApp();
};