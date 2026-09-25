IF DB_ID('EmployeeHub') IS NULL CREATE DATABASE EmployeeHub;
GO
USE EmployeeHub;
GO
IF OBJECT_ID('dbo.users', 'U') IS NULL
BEGIN
  CREATE TABLE users (
    id INT IDENTITY(1,1) CONSTRAINT PK_users PRIMARY KEY,
    username NVARCHAR(50) NOT NULL CONSTRAINT UQ_users_username UNIQUE,
    email NVARCHAR(255) NOT NULL CONSTRAINT UQ_users_email UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CONSTRAINT CK_users_role CHECK (role IN ('admin','viewer')) DEFAULT 'viewer',
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO
IF OBJECT_ID('dbo.employees', 'U') IS NULL
BEGIN
  CREATE TABLE employees (
    id INT IDENTITY(1,1) CONSTRAINT PK_employees PRIMARY KEY,
    first_name NVARCHAR(80) NOT NULL,
    last_name NVARCHAR(80) NOT NULL,
    email NVARCHAR(255) NOT NULL CONSTRAINT UQ_employees_email UNIQUE,
    contact_number NVARCHAR(30) NULL,
    department NVARCHAR(100) NOT NULL,
    position NVARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT CK_employees_status CHECK (status IN ('Active','Inactive')) DEFAULT 'Active',
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO
