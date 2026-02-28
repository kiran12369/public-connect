import axios, { AxiosError } from 'axios';
import { auth } from './firebase';

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const getBaseURL = (): string => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) throw new Error('NEXT_PUBLIC_API_URL is required');
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    } else if (isDev && typeof window !== 'undefined') {
        const isTestMode = localStorage.getItem('testMode') === 'true';
        const isAdminMode = localStorage.getItem('adminMode') === 'true';
        if (isTestMode) {
            config.headers.Authorization = `Bearer ${isAdminMode ? 'admin-token' : 'dev-token'}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
        const status = err.response?.status;
        if (status === 401) {
            if (typeof window !== 'undefined') window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;
