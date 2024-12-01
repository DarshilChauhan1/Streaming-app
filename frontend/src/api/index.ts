import axios from 'axios';
import { Register } from '../interfaces/Register.interface';
import { Login } from '../interfaces/Login.interface';
import { Upload } from '../interfaces/Upload.interface';
const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI,
    withCredentials: false,
})

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
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

const apiGetAllVideos = async (payload : {userId : string}) => {
    return api.get('/posts', payload);
}

const apiGetVideo = async (payload: { videoId : string }) => {
    const { videoId } = payload;
    return api.get(`/posts/${videoId}`); // Dynamic URL injection
  };

export {
    apiLogin,
    apiRegister,
    apiUpload,
    logout,
    apiGetAllVideos,
    apiGetVideo    
};