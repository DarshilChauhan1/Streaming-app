import axios from 'axios';
import { Register } from '../interfaces/Register.interface';
import { Login } from '../interfaces/Login.interface';
import { Upload } from '../interfaces/Upload.interface';
const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI,
    withCredentials: false,
    timeout: 120000
})

const apiLogin = async (data: Login) => {
    return api.post('/auth/login', data);
}

const apiRegister = async (data: Register) => {
    return api.post('/auth/sign-up', data);
}

const logout = async () => {
    return api.post('/auth/logout');
}

const apiUpload = async (payload: any) => {
    return api.post('/uploads', payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export {
    apiLogin,
    apiRegister,
    apiUpload,
    logout
};