// taskRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('./db');
const { verifyToken, isAdmin } = require('./authMiddleware');

router.get('/tasks', verifyToken, async (req, res) => {
    try {
        const query = 'SELECT * FROM tasks';
        const tasks = await connection.query(query);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// Protect this route with isAdmin middleware
router.delete('/tasks/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const taskId = req.params.id;
        const query = 'DELETE FROM tasks WHERE id = ?';
        await connection.query(query, [taskId]);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

// Get tasks for the authenticated user
router.get('/tasks', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Retrieve user ID from the authenticated user
        const query = 'SELECT * FROM tasks WHERE user_id = ?';
        const tasks = await connection.query(query, [userId]);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// Create a new task for the authenticated user
router.post('/tasks', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Retrieve user ID from the authenticated user
        const { title, description, status } = req.body;
        const query = 'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)';
        await connection.query(query, [title, description, status, userId]);
        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Error creating task' });
    }
});

// Update task associated with the authenticated user
router.put('/tasks/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Retrieve user ID from the authenticated user
        const taskId = req.params.id;
        const { title, description, status } = req.body;
        const query = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?';
        await connection.query(query, [title, description, status, taskId, userId]);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Delete task associated with the authenticated user
router.delete('/tasks/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Retrieve user ID from the authenticated user
        const taskId = req.params.id;
        const query = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
        await connection.query(query, [taskId, userId]);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;
