import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      // Handle error
    }
  };

  const addTask = async (title: string) => {
    try {
      const response = await axios.post('/api/tasks', { title });
      setTasks([...tasks, response.data]);
    } catch (error) {
      // Handle error
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, updates);
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (error) {
      // Handle error
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      {/* Render tasks */}
      {/* Add task form */}
      {/* Update and delete task buttons */}
    </div>
  );
};

export default TodoList;