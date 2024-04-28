const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000; // or any port you prefer

// MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'task_manager'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes for CRUD operations

// Create a new task
app.post('/tasks', (req, res) => {
    const { task_name, description, due_date, status } = req.body;
    const query = 'INSERT INTO tasks (task_name, description, due_date, status) VALUES (?, ?, ?, ?)';
    connection.query(query, [task_name, description, due_date, status], (err, results) => {
        if (err) {
            console.error('Error creating task:', err);
            res.status(500).json({ error: 'Error creating task' });
            return;
        }
        res.status(201).json({ id: results.insertId });
    });
});

// Read all tasks
app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error reading tasks:', err);
            res.status(500).json({ error: 'Error reading tasks' });
            return;
        }
        res.json(results);
    });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const { task_name, description, due_date, status } = req.body;
    const taskId = req.params.id;
    const query = 'UPDATE tasks SET task_name = ?, description = ?, due_date = ?, status = ? WHERE id = ?';
    connection.query(query, [task_name, description, due_date, status, taskId], (err, results) => {
        if (err) {
            console.error('Error updating task:', err);
            res.status(500).json({ error: 'Error updating task' });
            return;
        }
        res.json({ message: 'Task updated successfully' });
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const query = 'DELETE FROM tasks WHERE id = ?';
    connection.query(query, [taskId], (err, results) => {
        if (err) {
            console.error('Error deleting task:', err);
            res.status(500).json({ error: 'Error deleting task' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
