const mysql = require("mysql");
const inquirer = require('inquirer');

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employees_db",
});

// Function to execute SQL query to view all departments.
function viewAllDepartments() {
  const sql = "SELECT id AS 'Department ID', name AS 'Department Name' FROM department";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving departments:", err);
      return;
    }
    
    console.table(results);
  });
}

// Function to execute SQL query to view all roles.
function viewAllRoles() {
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
      return;
    }
    
    console.table(results);
  });
}


// Function to execute SQL query view all employees.
function viewAllEmployees() {
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
      return;
    }

    console.table(results);
  });
}


// Function to add a department
function addDepartment() {

  //Prompt user to input new department.
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
      },
    ])
    .then((userInput) => {
      const departmentName = userInput.departmentName;

      //Take userInput and execute SQL query to add a department.
      const sql = 'INSERT INTO department (name) VALUES (?)';

      db.query(sql, [departmentName], (err, results) => {
        if (err) {
          console.error('Error adding department:', err);
          return;
        }

        console.log(`Department '${departmentName}' added successfully.`);
      });
    });
}

// Function to add a role
function addRole() {
  // Fetch the list of departments from the database
  const departmentQuery = 'SELECT id, name FROM department';

  db.query(departmentQuery, (deptErr, deptResults) => {
    if (deptErr) {
      console.error('Error fetching departments:', deptErr);
      return;
    }

    const departmentChoices = deptResults.map((dept) => ({
      name: dept.name,
      value: dept.id,
    }));

    //Prompt user to input new role and salary, then choose a department.
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'roleTitle',
          message: 'What is the name of the role?',
        },
        {
          type: 'input',
          name: 'roleSalary',
          message: 'What is the salary of the role?',
        },
        {
          type: 'list',
          name: 'departmentId',
          message: 'Which departement doe the role belong to?',
          choices: departmentChoices,
        },
      ])
      .then((userInput) => {
        const roleTitle = userInput.roleTitle;
        const roleSalary = userInput.roleSalary;
        const departmentId = userInput.departmentId;

        //Take userInput and execute SQL query to add a role.
        const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';

        db.query(sql, [roleTitle, roleSalary, departmentId], (err, results) => {
          if (err) {
            console.error('Error adding role:', err);
            return;
          }

          console.log(`Role '${roleTitle}' added successfully.`);
        });
      });
  });
}

// Function to add an employee
function addEmployee() {
  // Fetch the list of roles from the database
  const roleQuery = 'SELECT id, title FROM role';

  db.query(roleQuery, (roleErr, roleResults) => {
    if (roleErr) {
      console.error('Error fetching roles:', roleErr);
      return;
    }

    const roleChoices = roleResults.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Fetch the list of employees from the database
    const employeeQuery = 'SELECT id, first_name, last_name FROM employee';

    db.query(employeeQuery, (empErr, empResults) => {
      if (empErr) {
        console.error('Error fetching employees:', empErr);
        return;
      }

      const employeeChoices = empResults.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));

      //Prompt user to input new emploee name, then choose role and manager.
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'firstName',
            message: 'Enter the employee\'s first name:',
          },
          {
            type: 'input',
            name: 'lastName',
            message: 'Enter the employee\'s last name:',
          },
          {
            type: 'list',
            name: 'roleId',
            message: 'Select the role for the employee:',
            choices: roleChoices,
          },
          {
            type: 'list',
            name: 'managerId',
            message: 'Select the employee\'s manager:',
            choices: employeeChoices.concat([{ name: 'None', value: null }]), // Add "None" option
          },
        ])
        .then((userInput) => {
          const firstName = userInput.firstName;
          const lastName = userInput.lastName;
          const roleId = userInput.roleId;
          const managerId = userInput.managerId;

          // Taker user input and execute the SQL query to add an employee.
          const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';

          db.query(sql, [firstName, lastName, roleId, managerId], (err, results) => {
            if (err) {
              console.error('Error adding employee:', err);
              return;
            }

            console.log(`Employee '${firstName} ${lastName}' added successfully.`);
          });
        });
    });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  // Fetch the list of employees from the database
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee';

  db.query(employeeQuery, (empErr, empResults) => {
    if (empErr) {
      console.error('Error fetching employees:', empErr);
      return;
    }

    const employeeChoices = empResults.map((employee) => ({
      name: employee.full_name,
      value: employee.id,
    }));

    // Fetch the list of roles from the database
    const roleQuery = 'SELECT id, title FROM role';

    db.query(roleQuery, (roleErr, roleResults) => {
      if (roleErr) {
        console.error('Error fetching roles:', roleErr);
        return;
      }

      const roleChoices = roleResults.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      // Prompt user to select an employee and a new role
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employeeChoices,
          },
          {
            type: 'list',
            name: 'newRoleId',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
          },
        ])
        .then((userInput) => {
          const employeeId = userInput.employeeId;
          const newRoleId = userInput.newRoleId;

          // Taker user input and execute the SQL query to update the employee's role
          const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';

          db.query(sql, [newRoleId, employeeId], (err, results) => {
            if (err) {
              console.error("Error updating employee's role:", err);
              return;
            }

            if (results.affectedRows === 1) {
              console.log('Employee\'s role updated successfully.');
            } else {
              console.log('Employee not found or role not updated.');
            }
          });
        });
    });
  });
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
