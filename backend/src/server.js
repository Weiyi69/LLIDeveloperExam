const app = require('./app');
const { port } = require('./config/env');
app.listen(port, () => console.log(`EmployeeHub API running on http://localhost:${port}`));
