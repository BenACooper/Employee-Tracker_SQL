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
} = require("./db/db.js");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employees_db",
});

// Call the correct prepared statement based on users answers.
const startApp = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "menuChoice",
        message: "What would you like to do?",
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
    ]);

    // Handle the user's choice here
    const choice = answers.menuChoice;

    // Call the correct prepared statements based on the user's choice
    switch (choice) {
      case "View all departments":
        await viewAllDepartments();
        startApp();
        break;
      case "View all roles":
        await viewAllRoles();
        startApp();
        break;
      case "View all employees":
        await viewAllEmployees();
        startApp();
        break;
      case "Add a department":
        await addDepartment();
        startApp();
        break;
      case "Add a role":
        await addRole();
        startApp();
        break;
      case "Add an employee":
        await addEmployee();
        startApp();
        break;
      case "Update an employee role":
        await updateEmployeeRole();
        startApp();
        break;
      case "Exit":
        console.log("Exiting the application.");
        process.exit(); // Terminate the Node.js process
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Call the startApp function to begin the application
startApp();
