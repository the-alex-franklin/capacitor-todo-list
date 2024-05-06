import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthForm } from 'src/pages/AuthForm.tsx';
import { TodoList } from 'src/pages/TodoList.tsx';
import { RootState } from './redux/store.ts';
import { useEffect, useState } from 'react';
import { setLoginState } from './redux/authReducer.ts';
import { delay } from './utils/functions/delay.ts';
import { clampZero } from './utils/functions/clampZero.ts';
import axios from 'axios';
import "virtual:windi.css";
import { API_URL } from './env.ts';

export const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async function checkLogin() {
      const start_time = Date.now();
      const access_token = localStorage.getItem('todo-list-access-token');

      await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }).then(() => {
        dispatch(setLoginState(true));
      }).catch(() => {
        dispatch(setLoginState(false));
      }).finally(async () => {
        await delay(clampZero((start_time - Date.now()) + 250));
        setLoading(false);
      });
    })();
  }, [dispatch]);

  const isLoggedIn = useSelector<RootState>((state) => state.auth.isLoggedIn);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <h1 className="text-purple-500 text-2xl font-bold mb-4">Loading...</h1>
    </div>
  );

  return (
    <div className="bg-gray-900 h-screen">
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <TodoList /> : <AuthForm />} />
        </Routes>
      </Router>
    </div>
  );
};
