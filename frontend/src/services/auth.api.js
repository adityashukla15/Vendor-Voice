import api from './api';

export const sendOTP = (payload) => api.post('/otp/send', payload);
export const verifyOTP = (payload) => api.post('/otp/verify', payload);
export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const logoutUser = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');
export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => api.post('/auth/reset-password', payload);
