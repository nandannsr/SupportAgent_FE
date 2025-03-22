// src/services/api.js
import { config } from '../config';

const BASE_URL = config.api.baseUrl;

export const login = async (username, password) => {
  const response = await fetch(`${BASE_URL}token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Invalid credentials');
  return response.json();
};

export const getCustomers = async (token) => {
  const response = await fetch(`${BASE_URL}customers/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch customers');
  return response.json();
};

export const getMessages = async (token, customerId) => {
  const response = await fetch(`${BASE_URL}messages/?customer_id=${customerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

export const sendMessage = async (token, customerId, content) => {
  const response = await fetch(`${BASE_URL}messages/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ customer_id: customerId, content }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

export const getNotifications = async (token) => {
  const response = await fetch(`${BASE_URL}notifications/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
};

export const markNotificationAsRead = async (token, notificationId) => {
  const response = await fetch(`${BASE_URL}notifications/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: notificationId }),
  });
  if (!response.ok) throw new Error('Failed to mark notification as read');
  return response.json();
};