const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
taskSchema.index({ user: 1 }); // Frequent query: find tasks by user
taskSchema.index({ status: 1 }); // Frequent filter: by status
taskSchema.index({ title: 'text', description: 'text' }); // For text search capabilities

module.exports = mongoose.model('Task', taskSchema);
