import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup.tsx';
import Login from './pages/Login.tsx';
import TodoList from './pages/TodoList.tsx';

function App() {
  return (
    <div className="bg-gray-900 h-screen text-white">
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/" element={<Signup />} />  // Default route for now
        </Routes>
      </Router>
    </div>
  );
}

export default App;
