import { createContext, useContext, useState } from 'react';
import { login, logout, register } from '../api/index';
import { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
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
  const [loading, setLoading] = useState(false); // Changed from Loading to loading

  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await login(data);
      console.log("response", response);
      setUser(response?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const registerAsync = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await register(data);
      setUser(response.data);
      console.log(response);
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
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, registerAsync, logout, loading }}>
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
