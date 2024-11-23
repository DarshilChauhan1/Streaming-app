import { createContext, useContext, useState } from 'react';
import { apiLogin, logout, apiRegister } from '../api/index';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext<{
  user: null;
  login: (data: { email: string; password: string }) => Promise<void>;
  registerAsync: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean; // Add loading state to the context type
}>({
  user: null,
  login: async () => {},
  registerAsync: async () => {},
  logout: async () => {},
  loading: false, // Provide a default value for loading
});

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await apiLogin(data);
      setUser(response?.data?.data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const registerAsync = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      const response = await apiRegister(data);
      setUser(response.data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return error?.response?.data;
      }
      console.log(error);
    } 
  };

  const logout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, registerAsync, logout }}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
