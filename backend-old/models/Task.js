const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    dueDate: { type: String },
    createdAt: { type: Date, default: Date.now },
    position: { type: Number, default: 0 } // for drag-drop ordering
});

module.exports = mongoose.model("Task", TaskSchema);
