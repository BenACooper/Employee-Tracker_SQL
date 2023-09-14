const inquirer = require("inquirer");
const mysql = require("mysql2");

//import prepared statements
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require("./db");

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
  inquirer
    .prompt([
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
    ])
    .then((answers) => {
      // Handle the user's choice here
      const choice = answers.menuChoice;

      // Call the correct prepared statements based on the user's choice
      switch (choice) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartemnt();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          console.log("Exiting the application.");
          process.exit(); // Terminate the Node.js process
      }
    });
}

// Call the startApp function to begin the application
startApp();
