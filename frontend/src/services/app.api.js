import api from './api';

export const getDashboardOverview = () => api.get('/dashboard/overview');

export const getInventory = () => api.get('/inventory/all');
export const createInventoryItem = (payload) => api.post('/inventory/create', payload);
export const updateInventoryItem = (id, payload) => api.put(`/inventory/update/${id}`, payload);
export const deleteInventoryItem = (id) => api.delete(`/inventory/delete/${id}`);

export const getCustomers = () => api.get('/customer/all');
export const createCustomer = (payload) => api.post('/customer/create', payload);
export const updateCustomer = (id, payload) => api.put(`/customer/update/${id}`, payload);
export const deleteCustomer = (id) => api.delete(`/customer/delete/${id}`);

export const getTransactions = () => api.get('/ledger/all');
export const createSaleTransaction = (payload) => api.post('/ledger/sale', payload);
export const createPaymentTransaction = (payload) => api.post('/ledger/payment', payload);

export const processAI = (payload) => api.post('/ai/process', payload);
export const sendWhatsAppReminder = (payload) => api.post('/whatsapp/send-reminder', payload);
