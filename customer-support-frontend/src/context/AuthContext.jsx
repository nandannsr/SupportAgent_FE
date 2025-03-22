import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Try to get token from localStorage on init
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);

  // Save token changes to localStorage
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  const login = (token) => {
    setAuthToken(token);
    // Optionally, decode the token and set the user info
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
