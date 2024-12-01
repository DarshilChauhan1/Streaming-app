import { createContext, useContext, useEffect, useState } from 'react';
import { apiLogin, logout, apiRegister } from '../api/index';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalStorage } from '../utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

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
  const [user, setUser] = useState(() => {
    const storedUser = LocalStorage.get('user');
    return storedUser ? storedUser : null;
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // check if the user has no accessToken or refreshToken in localstorage then throw him to login
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      setUser(null);
      navigate('/login');
    } else {
      // Prevent navigating to login if tokens are valid
      if (location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/home');
      }
    }
    setLoading(false);
  }, [navigate]);

  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await apiLogin(data);
      if (response?.data?.success) {
        setUser(response?.data?.data?.user);
        toast.success(response?.data?.message);
        LocalStorage.set('accessToken', response?.data?.data?.tokens?.accessToken);
        LocalStorage.set('refreshToken', response?.data?.data?.tokens?.refreshToken);
        LocalStorage.set('user', JSON.stringify(response?.data?.data?.user));
      }
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
    <AuthContext.Provider value={{ user, login, registerAsync, logout }}>
      {loading ? <CircularProgress sx={{ marginTop: '20vh' }} /> : <>{children}</>}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
