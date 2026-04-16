require('dotenv').config(); // Nodemon trigger 2
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5005;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection
mongoose.connect('mongodb://marathemahika11_db_user:D8hPSOOzPqoYMW9H@mycluster-shard-00-00.81lufwb.mongodb.net:27017,mycluster-shard-00-01.81lufwb.mongodb.net:27017,mycluster-shard-00-02.81lufwb.mongodb.net:27017/tasktracker?ssl=true&replicaSet=atlas-mycluster-shard-0&authSource=admin&retryWrites=true&w=majority')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const Task = require('./models/Task');

// CREATE a task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, deadline, status } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const newTask = new Task({ title, description, deadline, status });
        const savedTask = await newTask.save();
        res.status(201).json({ message: 'Task added successfully', task: savedTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// READ all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Recently created first
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedTask = await Task.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
        
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
