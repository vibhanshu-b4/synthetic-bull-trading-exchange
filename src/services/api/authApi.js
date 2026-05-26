import { USE_MOCKS, MOCK_AUTH } from '../mockMode';

/**
 * @file authApi.js
 * @description REST API functions for user authentication (register, login).
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const jsonRequest = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.detail || data?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
};

const buildMockAuth = ({ username, email }) => ({
  access_token: MOCK_AUTH.access_token,
  username: username || email || MOCK_AUTH.username,
  user_id: MOCK_AUTH.user_id,
});

export const register = async ({ username, email, password }) =>
  (USE_MOCKS
    ? buildMockAuth({ username, email })
    : jsonRequest('/api/v1/auth/register', { username, email, password }));

export const login = async ({ username, password }) =>
  (USE_MOCKS
    ? buildMockAuth({ username })
    : jsonRequest('/api/v1/auth/login', { username, password }));

