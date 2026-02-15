import axios, { InternalAxiosRequestConfig } from 'axios';

const AUTH_URL = 'http://localhost:5000/api';
const SALARY_URL = 'http://localhost:5001/api';

let accessToken: string | null = null;

// Function to set token from AuthContext
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Function to get current token
export const getAccessToken = () => accessToken;

// Shared request interceptor logic
const addAuthToken = (config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

// Shared response interceptor logic with retry
const handleAuthError = async (error: any) => {
  const originalRequest = error.config;

  // Don't retry for login, signup, or refresh endpoints to avoid infinite loops
  const isAuthRequest = originalRequest.url?.includes('/auth/login') ||
    originalRequest.url?.includes('/auth/signup') ||
    originalRequest.url?.includes('/auth/refresh');

  if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
    originalRequest._retry = true;

    try {
      // Try to refresh the token
      const response = await authApi.post('/auth/refresh');
      const { token } = response.data;

      setAccessToken(token);

      // Retry the original request with new token
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return axios(originalRequest);
    } catch (refreshError) {
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        setAccessToken(null);
        window.location.href = '/auth/login';
      }
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};

// Auth Service API
export const authApi = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true, // Important for httpOnly cookies
});
authApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
authApi.interceptors.response.use((response) => response, handleAuthError);

// Salary Service API
export const salaryApi = axios.create({
  baseURL: SALARY_URL,
  withCredentials: true,
});
salaryApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
salaryApi.interceptors.response.use((response) => response, handleAuthError);

export default salaryApi;
