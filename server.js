const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────
// 1. GET ALL EMPLOYEES
// GET /api/employees
// ─────────────────────────────────────────────
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM employees', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 2. GET EMPLOYEE BY ID
// GET /api/employees/:id
// ─────────────────────────────────────────────
app.get('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    if (!employee) {
      return res.status(200).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 3. ADD A NEW EMPLOYEE
// POST /api/employees
// ─────────────────────────────────────────────
app.post('/api/employees', async (req, res) => {
  const { name, age, mobile, city, department, salary } = req.body;
  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO employees (name, age, mobile, city, department, salary) VALUES (?, ?, ?, ?, ?, ?)',
        [name, age, mobile, city, department, salary],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    const newEmployee = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM employees WHERE id = ?', [result], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.status(200).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 4. UPDATE AN EXISTING EMPLOYEE
// PUT /api/employees/:id
// ─────────────────────────────────────────────
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, mobile, city, department, salary } = req.body;
  try {
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE employees SET name = ?, age = ?, mobile = ?, city = ?, department = ?, salary = ? WHERE id = ?',
        [name, age, mobile, city, department, salary, id],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });

    const updatedEmployee = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 5. DELETE AN EMPLOYEE
// DELETE /api/employees/:id
// ─────────────────────────────────────────────
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM employees WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    res.status(200).json({ message: `Employee with ID ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// 6. GET COMPENSATION (DEPARTMENT & SALARY) BY EMPLOYEE ID
// GET /api/employees/compensation/:id
// ─────────────────────────────────────────────
app.get('/api/employees/compensation/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const compensation = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, name, department, salary FROM employees WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!compensation) {
      return res.status(200).json({ message: 'Employee not found' });
    }

    res.status(200).json(compensation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
