const Task = require("../models/Task");

// Get tasks of a project
exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.id }).sort({ position: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a task to a project
exports.addTask = async (req, res) => {
    try {
        const task = new Task({ projectId: req.params.id, ...req.body });
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a task (status, title, priority, dueDate)
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Reorder tasks (drag-drop)
exports.reorderTasks = async (req, res) => {
    try {
        const { orderedIds } = req.body;
        for (let i = 0; i < orderedIds.length; i++) {
            await Task.findByIdAndUpdate(orderedIds[i], { position: i });
        }
        res.json({ message: "Tasks reordered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
