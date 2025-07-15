# Employee-management_system
Authentication project
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const ADMIN_PASSWORD = 'admin123';

let employees = [
  { id: 1, name: 'John Doe', email: 'john@example.com', position: 'Manager' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', position: 'Developer' }
];

function checkAuth(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

app.get('/api/employees', checkAuth, (req, res) => {
  res.json(employees);
});

app.post('/api/employees', checkAuth, (req, res) => {
  const { name, email, position } = req.body;
  if (!name || !email || !position) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const id = employees.length ? employees[employees.length - 1].id + 1 : 1;
  const newEmp = { id, name, email, position };
  employees.push(newEmp);
  res.status(201).json(newEmp);
});

app.put('/api/employees/:id', checkAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);
  if (!emp) return res.status(404).json({ error: 'Not found' });
  const { name, email, position } = req.body;
  if (!name || !email || !position) {
    return res.status(400).json({ error: 'All fields required' });
  }
  emp.name = name;
  emp.email = email;
  emp.position = position;
  res.json(emp);
});

app.delete('/api/employees/:id', checkAuth, (req, res) => {
  const id = parseInt(req.params.id);
  employees = employees.filter(e => e.id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
