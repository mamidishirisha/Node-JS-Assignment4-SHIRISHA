const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'employees.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDB();
  }
});

function initializeDB() {
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER,
      mobile TEXT,
      city TEXT,
      department TEXT,
      salary REAL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Employees table ready.');
      seedData();
    }
  });
}

function seedData() {
  db.get('SELECT COUNT(*) as count FROM employees', (err, row) => {
    if (err) return;
    if (row.count === 0) {
      const employees = [
        ['Vishnu', 29, '012345678', 'Chennai', 'Engineering', 55000],
        ['Rajesh', 30, '9412345678', 'Bangalore', 'Marketing', 60000],
        ['Saravanan', 31, '0812345678', 'Hyderabad', 'Finance', 65000],
        ['Ramesh', 32, '9781234561', 'Mumbai', 'HR', 58000],
        ['John', 33, '9456781234', 'Delhi', 'Engineering', 70000]
      ];
      const stmt = db.prepare(
        'INSERT INTO employees (name, age, mobile, city, department, salary) VALUES (?, ?, ?, ?, ?, ?)'
      );
      employees.forEach(emp => stmt.run(emp));
      stmt.finalize();
      console.log('Seed data inserted.');
    }
  });
}

module.exports = db;
