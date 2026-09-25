USE EmployeeHub;
GO
-- Password for both accounts: Password123!
IF NOT EXISTS (SELECT 1 FROM users WHERE username='admin') INSERT INTO users (username,email,password_hash,role) VALUES ('admin','admin@employeehub.local','$2b$10$UIpTbWHXKXjKYO6QYklApeKnWh9g5AoNQp2HIQIgQcLdzL3sLWsai','admin');
IF NOT EXISTS (SELECT 1 FROM users WHERE username='viewer') INSERT INTO users (username,email,password_hash,role) VALUES ('viewer','viewer@employeehub.local','$2b$10$UIpTbWHXKXjKYO6QYklApeKnWh9g5AoNQp2HIQIgQcLdzL3sLWsai','viewer');
IF NOT EXISTS (SELECT 1 FROM employees)
INSERT INTO employees (first_name,last_name,email,contact_number,department,position,status) VALUES
('Maya','Chen','maya.chen@employeehub.local','555-0101','Engineering','Senior Developer','Active'),
('Jonah','Williams','jonah.williams@employeehub.local','555-0102','Operations','Operations Lead','Active'),
('Ari','Patel','ari.patel@employeehub.local','555-0103','People','People Partner','Active'),
('Noah','Garcia','noah.garcia@employeehub.local','555-0104','Finance','Financial Analyst','Inactive'),
('Lena','Brooks','lena.brooks@employeehub.local','555-0105','Engineering','QA Engineer','Active');
GO
