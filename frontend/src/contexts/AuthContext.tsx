
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  oAuthLogin: (provider: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  joinedDate: 'January 2023'
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for saved authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Simulating successful login
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      toast.success('Login successful', {
        description: 'Welcome back to your account'
      });
      
      navigate('/');
    } catch (error) {
      toast.error('Login failed', {
        description: 'Invalid email or password'
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create a user with provided name and email
      const newUser = {
        ...mockUser,
        name,
        email,
      };
      
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      toast.success('Registration successful', {
        description: 'Your account has been created'
      });
      
      navigate('/');
    } catch (error) {
      toast.error('Registration failed', {
        description: 'There was an error creating your account'
      });
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    
    toast('Logged out successfully', {
      description: 'You have been securely logged out'
    });
    
    navigate('/');
  };

  const oAuthLogin = async (provider: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would trigger OAuth flow
      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Simulating successful OAuth login
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      toast.success('Login successful', {
        description: `You've been authenticated with ${provider}`
      });
      
      navigate('/');
    } catch (error) {
      toast.error('Authentication failed', {
        description: `Could not authenticate with ${provider}`
      });
      console.error('OAuth login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    oAuthLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
