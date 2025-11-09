const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");

// Projects
router.get("/", projectController.getProjects);
router.post("/", projectController.addProject);

// Tasks under project
router.get("/:id/tasks", taskController.getTasksByProject);
router.post("/:id/tasks", taskController.addTask);

module.exports = router;
