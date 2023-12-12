const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  description: {
    type: String,
    required: true,
    collation: { locale: "en", strength: 2 },
  },
  deadline: {
    type: Date,
    required: true,
  },
  taskStatus: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TaskModel = mongoose.model("TaskModel", taskSchema);

module.exports = TaskModel;