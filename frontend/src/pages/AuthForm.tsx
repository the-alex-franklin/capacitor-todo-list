import axios from 'axios';
import React, { useState } from 'react';
import { signup_validator } from '../validators/signup.validator.ts';
import { setLoginState } from '../redux/authReducer.ts';
import { useDispatch } from 'react-redux';
import { API_URL } from '../env.ts';

export const AuthForm: React.FC = () => {
  const dispatch = useDispatch();
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = await axios.post<unknown>(`${API_URL}/${isSignup ? 'signup' : 'login'}`, { username, password })
      .then(response => signup_validator.parse(response.data))
      .catch(console.error);

    if (!data) return;
    const { access_token, refresh_token } = data;
    localStorage.setItem(`todo-list-access-token`, access_token);
    localStorage.setItem(`todo-list-refresh-token`, refresh_token);
    dispatch(setLoginState(true));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
        <h1 className="text-purple-500 text-2xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Login'}</h1>
        <form onSubmit={handleSubmit} className="gap-6 flex flex-col">
          <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn bg-purple-500 rounded p-2 mr-4 w-min self-end">
            Submit
          </button>
        </form>
        <button onClick={() => setIsSignup(!isSignup)} className="btn btn-link mt-4 text-white">
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};
