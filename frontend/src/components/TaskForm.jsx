import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTasks, FaAlignLeft, FaSave, FaTimes } from 'react-icons/fa';
import API from '../api/axios';

const TaskForm = ({ onTaskAdded, onTaskUpdated, editingTask, setEditingTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      // Scroll to form when editing starts
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingTask]);

  const onCancel = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      if (editingTask) {
        // Update existing task
        const { data } = await API.put(`/api/tasks/${editingTask._id}`, { title, description });
        onTaskUpdated(data);
        toast.success('Task updated successfully');
        onCancel();
      } else {
        // Create new task
        const { data } = await API.post('/api/tasks', { title, description });
        onTaskAdded(data);
        setTitle('');
        setDescription('');
        toast.success('Task added successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    }
  };

  return (
    <section className="mb-8">
      <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${editingTask ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
                    {editingTask ? (
                        <FaSave className="text-yellow-600 dark:text-yellow-300" />
                    ) : (
                        <FaPlus className="text-blue-600 dark:text-blue-300" />
                    )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                </h3>
            </div>
            {editingTask && (
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Cancel Edit"
                >
                    <FaTimes size={20} />
                </button>
            )}
        </div>
        
        <div className="space-y-4">
            <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Task Title
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTasks className="text-gray-400" />
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Enter task title"
                />
            </div>
            </div>
            
            <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Description
            </label>
            <div className="relative">
                 <div className="absolute top-3 left-3 pointer-events-none">
                    <FaAlignLeft className="text-gray-400" />
                </div>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors min-h-[100px]"
                    placeholder="Enter task description"
                ></textarea>
            </div>
            </div>

            <button
            type="submit"
            className={`w-full font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center space-x-2 shadow-md ${
                editingTask 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white'
            }`}
            >
            {editingTask ? <FaSave /> : <FaPlus />}
            <span>{editingTask ? 'Update Task' : 'Add Task'}</span>
            </button>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
