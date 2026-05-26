const raw = String(import.meta.env.VITE_USE_MOCKS || '').toLowerCase();

export const USE_MOCKS = raw === 'true' || raw === '1' || raw === 'yes';

export const MOCK_AUTH = {
  access_token: 'mock-token',
  username: 'Demo Trader',
  user_id: 'demo',
};

export const MOCK_USER = {
  token: MOCK_AUTH.access_token,
  username: MOCK_AUTH.username,
  userId: MOCK_AUTH.user_id,
};
