// app.js
const express = require('express');
const app = express();
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
