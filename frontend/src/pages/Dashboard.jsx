import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaClipboardList, FaSearch, FaFilter } from 'react-icons/fa';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import useAuth from '../hooks/useAuth';
import API from '../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  
  // New States for Features
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, done, todo

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, [user, navigate]);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/api/tasks');
      setTasks(data);
    } catch (error) {
        console.error("Error fetching tasks:", error);
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const onTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const onTaskDeleted = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
  };

  const onTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  // Filter Tasks Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading || isLoadingTasks) return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 dark:bg-gray-900 min-h-screen transition-colors">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <FaClipboardList className="text-blue-600 dark:text-blue-400" />
                Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user && user.name.split(' ')[0]}!
            </p>
        </div>
        
        <div className="bg-blue-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-blue-100 dark:border-gray-700">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {tasks.filter(t => t.status !== 'done').length} Pending Tasks
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <TaskForm 
                onTaskAdded={onTaskAdded} 
                onTaskUpdated={onTaskUpdated}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
            />
          </div>
        </div>
        
        {/* Right Column: Task List */}
        <div className="lg:col-span-2">
          
          {/* Search & Filter Controls */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>
            
            <div className="relative min-w-[150px]">
                <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                    <option value="all">All Tasks</option>
                    <option value="todo">Pending</option>
                    <option value="done">Completed</option>
                </select>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Task List</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredTasks.length} of {tasks.length}
            </span>
          </div>
          
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onTaskDeleted={onTaskDeleted}
                  onTaskUpdated={onTaskUpdated}
                  onEdit={setEditingTask}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {searchQuery ? 'No matching tasks found.' : 'No tasks to display.'}
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
