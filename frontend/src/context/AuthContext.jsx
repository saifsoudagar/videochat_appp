import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!Array.isArray(parsedUser.interests)) {
          parsedUser.interests = [];
        }
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
  }, []);

  const login = (userData) => {
    if (!Array.isArray(userData.interests)) {
      userData.interests = [];
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
