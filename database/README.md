# Database

Run `schema.sql` in SQL Server Management Studio, then run `seed.sql`. The seed accounts use `Password123!`.

The schema creates the `EmployeeHub` database, `users`, and `employees` tables with keys, constraints, and UTC timestamps. The backend uses parameterized `mssql` requests for all runtime queries.
