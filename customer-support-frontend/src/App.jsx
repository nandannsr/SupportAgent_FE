import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import NavBar from './components/NavBar';

const Layout = () => {
  return (
    <>
      <NavBar />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="chat/:customerId" element={<Chat />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;