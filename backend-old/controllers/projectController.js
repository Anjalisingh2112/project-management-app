const Project = require("../models/Project");

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new project
exports.addProject = async (req, res) => {
    try {
        const project = new Project({ name: req.body.name });
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
