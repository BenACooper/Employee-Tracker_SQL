const mysql = require('mysql');

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'employees_db',
});

// Function to view all departments
function viewAllDepartments() {
  const query = 'SELECT id, name AS department FROM department';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving departments:', err);
      return;
    }

    console.table(results); // Format and display the results as a table
  });
}

// Function to view all roles
function viewAllRoles() {
  // Implement SQL query to view all roles
}

// Function to view all employees
function viewAllEmployees() {
  // Implement SQL query to view all employees
}

// Function to add a department
function addDepartment(departmentName) {
  // Implement SQL query to add a department
}

// Function to add a role
function addRole(title, salary, departmentId) {
  // Implement SQL query to add a role
}

// Function to add an employee
function addEmployee(firstName, lastName, roleId, managerId) {
  // Implement SQL query to add an employee
}

// Function to update an employee's role
function updateEmployeeRole(employeeId, newRoleId) {
  // Implement SQL query to update an employee's role
}

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
