# Employee Management REST API

A Node.js + Express REST API for managing employee data with full CRUD operations.

## Setup & Run

```bash
# Install dependencies
npm install

# Start server
npm start

# Or with auto-reload (dev mode)
npm run dev
```

Then open: **http://localhost:3000**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/employees | Get all employees |
| GET    | /api/employees/:id | Get employee by ID |
| POST   | /api/employees | Add new employee |
| PUT    | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |
| GET    | /api/employees/compensation/:id | Get department & salary by ID |

---

## Database Schema

SQLite database with `employees` table:

| Column     | Type    |
|------------|---------|
| id         | INTEGER (Auto Increment, Primary Key) |
| name       | TEXT    |
| age        | INTEGER |
| mobile     | TEXT    |
| city       | TEXT    |
| department | TEXT    |
| salary     | REAL    |

---

## Notes
- Uses **Promise**, **async/await** for all HTTP requests (as required)
- Loading spinner shown while HTTP requests are in progress
- SQLite database auto-created on first run with sample seed data
- Landing page at `http://localhost:3000` shows employee table with Add/Edit/Delete/Compensation actions
