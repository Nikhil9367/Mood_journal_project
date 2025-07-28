import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storageUtils } from '../utils/storage';

const AuthContext = createContext(undefined);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, isLoading: false, user: action.payload, isAuthenticated: true, error: null };
    case 'AUTH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedUser = storageUtils.getUser();
    if (savedUser) {
      dispatch({ type: 'AUTH_SUCCESS', payload: savedUser });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be API call
      const user = {
        id: '1',
        username: 'demo_user',
        email,
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        createdAt: new Date(),
      };
      
      storageUtils.saveUser(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Invalid credentials' });
    }
  };

  const register = async (username, email, password) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: Date.now().toString(),
        username,
        email,
        createdAt: new Date(),
      };
      
      storageUtils.saveUser(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Registration failed' });
    }
  };

  const logout = () => {
    storageUtils.clearUser();
    dispatch({ type: 'LOGOUT' });
  };

  const forgotPassword = async (email) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, this would send reset email
      console.log('Password reset email sent to:', email);
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Failed to send reset email' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      forgotPassword,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};