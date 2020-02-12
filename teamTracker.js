require('dotenv').config();
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
                for (let i = 0; i < rolesListRaw.length; i++) {
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
    // Varibles
    let employeesListRaw = "";
    let rolesListRaw = "";
    const employeesList = [];
    const rolesList = [];

    // query for all employees
    connection.query("SELECT * FROM employees", (err, res) => {
        if (err) throw err;

        // store results into a varible
        employeesListRaw = res;

        // loop through the list of employees
        employeesListRaw.forEach(employee => {

            // push employee's first and last name into an array
            employeesList.push(employee.first_name + " " + employee.last_name);
        })

        // query for list of roles
        connection.query("SELECT * FROM roles", (err, res) => {
            if (err) throw err;

            // store results into varible
            rolesListRaw = res;

            // loop through list of roles
            rolesListRaw.forEach(role => {

                // push role titles into an array
                rolesList.push(role.title);
            })

            // prompt user
            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: employeesList
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the new role of this employee?",
                    choices: rolesList
                }
            ]).then(answers => {
                let employeeID;
                let roleID;
                const role = answers.role;
                const employee = answers.employee;

                // loop through list of employees to find whih employee to update
                for (let i = 0; i < employeesListRaw.length; i++) {
                    if (employee === (employeesListRaw[i].first_name + " " + employeesListRaw[i].last_name)) {
                        employeeID = employeesListRaw[i].id;
                    }
                }

                // loop through list of roles to find which role to use
                for (let i = 0; i < rolesListRaw.length; i++) {
                    if (role === rolesListRaw[i].title) {
                        roleID = rolesListRaw[i].id;
                    }
                }

                // query to update employee's role
                let query = `UPDATE employees SET role_id = ${roleID} WHERE id = ${employeeID}`;

                connection.query(query, (err, res) => {
                    if (err) throw err;

                    console.log("Role updated.")

                    // query user again
                    startApp();
                });
            })
        })
    })
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
    // grab exisiting departments
    connection.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        const departmentsListRaw = res;
        const departmentsList = [];

        departmentsListRaw.forEach(department => {
            departmentsList.push(department.name);
        })

        inquirer.prompt([
            {
                name: "role",
                type: "input",
                message: "What is the role you would like to add?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary for this role?"
            },
            {
                name: "department",
                type: "list",
                message: "What department does this role belong to?",
                choices: departmentsList
            }
        ])

            .then((answers) => {
                let departmentID;
                const roleNew = answers.role;
                const salaryNew = answers.salary;

                // loop through list of departments
                for (let i = 0; i < departmentsListRaw.length; i++) {
                    if (answers.department === departmentsListRaw[i].name) {
                        departmentID = departmentsListRaw[i].id;
                    }
                }

                // query to add user inputs into employees table
                let query = "INSERT INTO roles SET ?";

                connection.query(query, {
                    title: roleNew,
                    salary: salaryNew,
                    depart_id: departmentID
                }, (err, res) => {
                    if (err) throw err;

                    console.log("Role added.")

                    startApp();
                });
            })
    })
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
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What is the department you would like to add?"
        }
    ])

        .then((answers) => {
            // query to add user inputs into employees table
            let query = "INSERT INTO departments SET ?";

            connection.query(query, {
                name: answers.department
            }, (err, res) => {
                if (err) throw err;

                console.log("Department added.")

                startApp();
            });
        });
};