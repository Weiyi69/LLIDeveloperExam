# EmployeeHub

EmployeeHub is a simple employee-management system built for the assessment requirements.

## Technology Used

- ReactJS with Vite
- Ant Design
- ExpressJS
- Microsoft SQL Server through the `mssql` package
- RESTful API
- JWT authentication
- Git and GitHub

## Features

- Login and logout
- Role-based access for administrator and viewer accounts
- Employee create, read, update, and delete operations
- Employee search and status filtering
- Dashboard statistics
- Employee, project, and task reports
- CSV export and print support
- Responsive web interface

## Prerequisites

Install the following before running the application:

- Node.js 18 or newer
- npm
- Git
- Microsoft SQL Server and SQL Server Management Studio for MSSQL mode

## Project Structure

```text
backend/     ExpressJS REST API
frontend/    ReactJS and Ant Design client
database/    SQL Server schema and seed scripts
```

## 1. Clone the Repository

```powershell
git clone <your-github-repository-url>
cd LLI-ASSESSMENT-EXAM
```

## 2. Install Dependencies

Open a terminal in the project root and install backend dependencies:

```powershell
cd backend
npm install
cd ..
```

Install frontend dependencies:

```powershell
cd frontend
npm install
cd ..
```

## 3. Configure the Backend

Create a backend environment file:

```powershell
Copy-Item backend\.env.example backend\.env
```

### Quick Start Without SQL Server

Use memory mode when you only need to run and demonstrate the application quickly. In `backend/.env`, use:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DB_MODE=memory
JWT_SECRET=replace-with-a-long-local-secret
JWT_EXPIRES_IN=8h
```

Memory mode includes sample employees and demo login accounts. Data created in memory mode is reset when the backend restarts.

### MSSQL Mode

For the assessment database setup, create the database and tables:

1. Open SQL Server Management Studio.
2. Open `database/schema.sql` and execute it.
3. Open `database/seed.sql` and execute it.
4. Update `backend/.env` with your SQL Server credentials:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DB_MODE=mssql
JWT_SECRET=replace-with-a-long-secret
JWT_EXPIRES_IN=8h
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=EmployeeHub
DB_USER=sa
DB_PASSWORD=your-sql-server-password
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

The backend uses parameterized SQL queries when `DB_MODE=mssql`.

## 4. Configure the Frontend

Create the frontend environment file:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

The default value is suitable for local development:

```env
VITE_API_URL=http://localhost:5000/api
```

If the backend is hosted elsewhere, replace the URL with the deployed API URL.

## 5. Start the Backend

Open the first terminal:

```powershell
cd backend
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

## 6. Start the Frontend

Open a second terminal:

```powershell
cd frontend
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## 7. Login Accounts

The seed accounts use the same password:

| Username | Email | Password | Role |
| --- | --- | --- | --- |
| `admin` | `admin@employeehub.local` | `Password123!` | Administrator |
| `viewer` | `viewer@employeehub.local` | `Password123!` | Viewer |

Administrators can create, edit, and delete employees. Viewer accounts have read-only access.

## 8. Test the Application

### Check API Health

With the backend running, execute:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

The response should show that the EmployeeHub API is healthy.

### Test Login

1. Open the frontend.
2. Enter username `admin`.
3. Enter password `Password123!`.
4. Confirm that the dashboard opens.
5. Sign out and confirm that the login page is displayed again.

### Test Employee CRUD

1. Open **Team management**.
2. Click **Add employee** and create a record.
3. Confirm the record appears in the employee list.
4. Click the edit button and update the record.
5. Confirm the updated values are displayed.
6. Delete the record and confirm it is removed.
7. Repeat the test with the `viewer` account and confirm that management controls are unavailable.

### Test Projects and Tasks

1. Open **Projects** or **Tasks**.
2. Edit an item and change its status to `Completed`.
3. Save the item.
4. Refresh the browser.
5. Confirm that the completed status remains.

Project and task demo data is stored in the browser's `localStorage` in the current frontend implementation. Employee data uses the REST API and can use MSSQL mode.

### Test Reports

1. Open **Reports**.
2. Select `Employees`, `Projects`, or `Tasks`.
3. Select a status such as `Completed`.
4. Click **Generate report**.
5. Confirm that the filtered records and summary counts are correct.
6. Test **Print** and **Export CSV**.

## 9. REST API Endpoints

### Authentication

```text
POST /api/auth/login
GET  /api/auth/user
```

### Employees

```text
GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Reports and Dashboard

```text
GET /api/reports/employees
GET /api/dashboard
GET /api/health
```

Protected endpoints require a JWT bearer token in the `Authorization` header:

```text
Authorization: Bearer <token>
```

## 10. Quality Checks

Run the frontend lint check and production build:

```powershell
cd frontend
npm run lint
npm run build
```

Run the backend directly:

```powershell
cd backend
npm start
```

There is currently no automated test suite. The documented checks above cover the main login, CRUD, reporting, and deployment workflows.

## Challenges Encountered

- Replacing third-party authentication with a self-contained JWT login while keeping protected API routes working.
- Supporting both memory mode for quick demonstrations and MSSQL mode for the assessment database requirement.
- Connecting the React client to the Express API with JWT bearer tokens and handling expired sessions.
- Making GitHub Pages subpath routing work while keeping local Vite routes usable.
- Keeping project and task status changes available after a browser refresh.
- Applying role-based permissions so administrators can modify employee data while viewers remain read-only.
- Keeping report filters, summary counts, CSV export, and printed output consistent with the displayed records.
- Configuring CORS correctly between the frontend and backend during local and hosted development.
