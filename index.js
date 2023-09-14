const inquirer = require("inquirer");
const mysql = require("mysql2");

//import query functions
const {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
  } = require('./queries.js')

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employees_db",
});

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
function startApp() {
  inquirer.prompt([
    {
      type: "list",
      name: "menuChoice",
      message: "What woulkd you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit", // You can add an exit option if needed
      ],
    },
  ]).then((voice))
}

// Call the startApp function to begin the application
startApp();