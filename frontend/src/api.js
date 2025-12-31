// src/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

// Car APIs
export const fetchCars = () => axios.get(`${API_BASE}/cars`);
export const addCar = (car) => axios.post(`${API_BASE}/cars`, car);

// Customer APIs
export const fetchCustomers = () => axios.get(`${API_BASE}/customers`);
export const addCustomer = (customer) => axios.post(`${API_BASE}/customers`, customer);

// Booking APIs
export const fetchBookings = () => axios.get(`${API_BASE}/bookings`);
export const addBooking = (booking) => axios.post(`${API_BASE}/bookings`, booking);
