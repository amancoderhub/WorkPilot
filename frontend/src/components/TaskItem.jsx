import { toast } from 'react-toastify';
import { FaTrash, FaCheck, FaUndo, FaClock, FaExclamationCircle, FaEdit } from 'react-icons/fa';
import API from '../api/axios';

const TaskItem = ({ task, onTaskDeleted, onTaskUpdated, onEdit }) => {
  const onDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`api/tasks/${task._id}`);
        onTaskDeleted(task._id);
        toast.success('Task deleted');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const onToggleStatus = async () => {
    try {
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      const { data } = await API.put(`/api/tasks/${task._id}`, {
        status: newStatus,
      });
      onTaskUpdated(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const isDone = task.status === 'done';

  return (
    <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md mb-4 border-l-4 transition-all hover:shadow-lg ${isDone ? 'border-green-500 opacity-75' : 'border-blue-500'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className={`text-lg font-bold ${isDone ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                {task.title}
            </h4>
            {isDone ? (
                <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs px-2 py-1 rounded-full flex items-center">
                    <FaCheck className="mr-1" size={10} /> Completed
                </span>
            ) : (
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 text-xs px-2 py-1 rounded-full flex items-center">
                    <FaExclamationCircle className="mr-1" size={10} /> Pending
                </span>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
            {task.description}
          </p>
          
          <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
            <FaClock className="mr-1" />
            {new Date(task.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={onToggleStatus}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              isDone
                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:text-yellow-300'
                : 'bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300'
            }`}
             title={isDone ? "Mark as Undone" : "Mark as Done"}
          >
            {isDone ? <FaUndo size={16} /> : <FaCheck size={16} />}
          </button>
          
          <button
            onClick={() => onEdit(task)}
            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 rounded-lg transition-colors flex items-center justify-center"
            title="Edit Task"
          >
            <FaEdit size={16} />
          </button>

          <button
            onClick={onDelete}
            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 rounded-lg transition-colors flex items-center justify-center"
            title="Delete Task"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
