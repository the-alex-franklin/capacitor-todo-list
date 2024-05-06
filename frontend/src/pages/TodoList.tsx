import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { API_URL } from '../env.ts';

const task_schema = z.object({
  _id: z.string(),
  value: z.string(),
  completed: z.boolean(),
});

type Task = z.infer<typeof task_schema>;

const getTasks = async () => {
  const access_token = localStorage.getItem('todo-list-access-token');

  return await axios.get<unknown>(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  .then(response => task_schema.array().parse(response.data))
  .catch(console.error);
};

const postNewTask = async (value: string) => {
  const access_token = localStorage.getItem('todo-list-access-token');

  return await axios.post<unknown>(`${API_URL}/tasks`, { value }, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  .then(response => task_schema.parse(response.data))
  .catch(console.error);
};

const deleteTask = async (taskId: string) => {
  const access_token = localStorage.getItem('todo-list-access-token');

  return await axios.delete(`${API_URL}/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  .then(response => response.data)
  .catch(console.error);
};

const patchTask = async (taskId: string, body: { value?: string, completed?: boolean }) => {
  const access_token = localStorage.getItem('todo-list-access-token');

  return await axios.patch(`${API_URL}/tasks/${taskId}`, body, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  .then(response => response.data)
  .catch(console.error);
};

export const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    (async () => {
      const tasks = await getTasks();
      setTasks(tasks ?? []);
    })();
  }, []);

  const handleAddTask = async (e: FormEvent<HTMLFormElement | undefined>) => {
    e.preventDefault();

    if (!newTask) return;
    await postNewTask(newTask);
    setNewTask('');

    const tasks = await getTasks();
    setTasks(tasks ?? []);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);

    const tasks = await getTasks();
    setTasks(tasks ?? []);
  };

  const handleToggleTaskCompletion = async (task: Task) => {
    await patchTask(task._id, { completed: !task.completed });

    const tasks = await getTasks();
    setTasks(tasks ?? []);
  };

  const logout = () => {
    localStorage.removeItem('todo-list-access-token');
    localStorage.removeItem('todo-list-refresh-token');
    window.location.reload();
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-700">Tasks</h2>
        <button className="bg-purple-500 p-4 rounded text-white" onClick={logout}>Logout</button>
      </div>
      <form onSubmit={handleAddTask} className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="flex-1 mr-2 p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Add
        </button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task._id} className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTaskCompletion(task)}
              className="mr-2"
            />
            {task.value}
            <button onClick={() => handleDeleteTask(task._id)} className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
