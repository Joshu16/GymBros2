import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initializing auth listener');
    const unsubscribe = onAuthStateChange((user) => {
      console.log('Auth state changed:', user);
      setUser(user);
      setLoading(false);
    });

    // Timeout para evitar que se quede cargando indefinidamente
    const timeout = setTimeout(() => {
      console.log('Auth timeout reached, setting loading to false');
      setLoading(false);
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const value = {
    user,
    loading,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
