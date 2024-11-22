import axios from 'axios';
import { Register } from '../interfaces/Register.interface';
import { Login } from '../interfaces/Login.interface';
const api = axios.create({
    baseURL : import.meta.env.VITE_SERVER_URI,
    withCredentials: false,
    timeout : 120000
})

const login = async (data: Login) => {
    return api.post('/auth/login', data);
}

const register = async (data: Register) => {
    return api.post('/auth/sign-up', data);
}

const logout = async () => {
    return api.post('/auth/logout');
}

export {
    login,
    register,
    logout
};