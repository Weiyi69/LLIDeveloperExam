# EmployeeHub API

Express REST API for EmployeeHub. Copy `.env.example` to `.env`, configure SQL Server, run the database scripts, then use `npm run dev`.

Architecture: routes delegate to controllers, controllers delegate to services, and services use parameterized `mssql` requests. `authenticate` protects APIs and `authorize('admin')` protects mutations.
