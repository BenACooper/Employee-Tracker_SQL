const mysql = require("mysql");
const inquirer = require("inquirer");

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employees_db",
});

// Function to execute SQL query to view all departments.
const viewAllDepartments = async () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id AS 'Department ID', name AS 'Department Name' FROM department";

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error retrieving departments:", err);
        reject(err); // Reject the promise on error
        return;
      }

      console.table(results);
      resolve(results); // Resolve the promise with the results
    });
  });
};

// Function to execute SQL query to view all roles.
const viewAllRoles = async () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        role.id AS 'Role ID',
        role.title AS 'Role Title',
        role.salary AS 'Role Salary',
        department.name AS 'Department Name'
      FROM
        role
      LEFT JOIN
        department ON role.department_id = department.id
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error retrieving roles:", err);
        reject(err); 
        return;
      }

      console.table(results);
      resolve(results); 
    });
  });
};

// Function to execute SQL query view all employees.
const viewAllEmployees = async () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        employee.id AS 'Employee ID',
        employee.first_name AS 'First Name',
        employee.last_name AS 'Last Name',
        role.title AS 'Job Title',
        department.name AS 'Department',
        role.salary AS 'Salary',
        CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
      FROM
        employee
      LEFT JOIN
        role ON employee.role_id = role.id
      LEFT JOIN
        department ON role.department_id = department.id
      LEFT JOIN
        employee AS manager ON employee.manager_id = manager.id
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error retrieving employees:', err);
        reject(err);
        return;
      }

      console.table(results);
      resolve(results);
    });
  });
};

// Function to add a department
const addDepartment = async () => {
  try {
    const userInput = await inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the new department called?",
      },
    ]);

    const departmentName = userInput.departmentName;

    // Take userInput and execute SQL query to add a department.
    const sql = "INSERT INTO department (name) VALUES (?)";

    const [results] = await db.promise().query(sql, [departmentName]);

    console.log(`Department '${departmentName}' added successfully.`);
  } catch (err) {
    console.error("Error adding department:", err);
  }
};

// Function to add a role
const addRole = async () => {

  // Fetch the list of departments from the database
  try {
    const departmentQuery = "SELECT id, name FROM department";

    const [deptResults] = await db.promise().query(departmentQuery);

    const departmentChoices = deptResults.map((dept) => ({
      name: dept.name,
      value: dept.id,
    }));

    // Prompt user to input new role and salary, then choose a department.
    const userInput = await inquirer.prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "departmentId",
        message: "Which department does the role belong to?",
        choices: departmentChoices,
      },
    ]);

    const roleTitle = userInput.roleTitle;
    const roleSalary = userInput.roleSalary;
    const departmentId = userInput.departmentId;

    // Take user input and execute SQL query to add a role.
    const sql = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";

    await db.promise().query(sql, [roleTitle, roleSalary, departmentId]);

    console.log(`Role '${roleTitle}' added successfully.`);
  } catch (err) {
    console.error("Error adding role:", err);
  }
};

// Function to add an employee
const addEmployee = async () => {
  try {
    // Fetch the list of roles from the database
    const roleQuery = "SELECT id, title FROM role";

    const [roleResults] = await db.promise().query(roleQuery);

    const roleChoices = roleResults.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Fetch the list of employees from the database
    const employeeQuery = "SELECT id, first_name, last_name FROM employee";

    const [empResults] = await db.promise().query(employeeQuery);

    const employeeChoices = empResults.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    // Prompt user to input new employee name, then choose role and manager.
    const userInput = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "roleId",
        message: "What is teh employee's role?",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "managerId",
        message: "Who is the employee's manager?",
        choices: employeeChoices.concat([{ name: "None", value: null }]), // Add "None" option in case we hiring the new boss
      },
    ]);

    const firstName = userInput.firstName;
    const lastName = userInput.lastName;
    const roleId = userInput.roleId;
    const managerId = userInput.managerId;

    // Take user input and execute the SQL query to add an employee.
    const sql =
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";

    const [results] = await db
      .promise()
      .query(sql, [firstName, lastName, roleId, managerId]);

    console.log(`Employee '${firstName} ${lastName}' added successfully.`);
  } catch (err) {
    console.error("Error adding employee:", err);
  }
};

// Function to update an employee's role
const updateEmployeeRole = async () => {
  try {
    // Fetch the list of employees from the database
    const employeeQuery = "SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee";

    const [empResults] = await db.promise().query(employeeQuery);

    const employeeChoices = empResults.map((employee) => ({
      name: employee.full_name,
      value: employee.id,
    }));

    // Fetch the list of roles from the database
    const roleQuery = "SELECT id, title FROM role";

    const [roleResults] = await db.promise().query(roleQuery);

    const roleChoices = roleResults.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Prompt user to select an employee and a new role
    const userInput = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "newRoleId",
        message: "Which role do you want to assign to the seleted employee?",
        choices: roleChoices,
      },
    ]);

    const employeeId = userInput.employeeId;
    const newRoleId = userInput.newRoleId;

    // Take user input and execute the SQL query to update the employee's role
    const sql = "UPDATE employee SET role_id = ? WHERE id = ?";

    const [results] = await db.promise().query(sql, [newRoleId, employeeId]);

    if (results.affectedRows === 1) {
      console.log("Employee's role updated successfully.");
    } else {
      console.log("Employee not found or role not updated.");
    }
  } catch (err) {
    console.error("Error updating employee's role:", err);
  }
};

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
