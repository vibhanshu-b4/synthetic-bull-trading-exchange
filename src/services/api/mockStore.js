const STORAGE_KEY = 'synthetic-bull/mock-store';

const defaultStore = {
  cashBalance: 250000,
  holdings: [
    { symbol: 'AAPL_S', quantity: 40, avg_cost: 178.25, current_price: 180.12 },
    { symbol: 'TSLA_S', quantity: 12.5, avg_cost: 248.5, current_price: 252.1 },
    { symbol: 'MSFT_S', quantity: 18, avg_cost: 372.3, current_price: 378.7 },
  ],
  orders: [
    { id: 'MOCK-1001', symbol: 'AAPL_S', side: 'buy', price: 176.2, quantity: 5, status: 'open' },
    { id: 'MOCK-1002', symbol: 'MSFT_S', side: 'sell', price: 382.4, quantity: 2, status: 'open' },
  ],
  trades: [
    { id: 'TRD-9001', symbol: 'AAPL_S', side: 'buy', price: 175.1, quantity: 4, timestamp: Date.now() - 3600 * 1000 },
    { id: 'TRD-9002', symbol: 'TSLA_S', side: 'sell', price: 254.2, quantity: 1.2, timestamp: Date.now() - 7200 * 1000 },
  ],
};

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const normalize = (store) => ({
  cashBalance: Number(store.cashBalance ?? defaultStore.cashBalance),
  holdings: Array.isArray(store.holdings) ? store.holdings : clone(defaultStore.holdings),
  orders: Array.isArray(store.orders) ? store.orders : [],
  trades: Array.isArray(store.trades) ? store.trades : [],
});

const loadStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalize(clone(defaultStore));
    const parsed = JSON.parse(raw);
    return normalize({ ...clone(defaultStore), ...parsed });
  } catch {
    return normalize(clone(defaultStore));
  }
};

let cached = null;

export const getMockStore = () => {
  if (!cached) cached = loadStore();
  return cached;
};

const saveMockStore = (store) => {
  cached = normalize(store);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // Ignore storage failures and keep in-memory data.
  }
};

export const updateMockStore = (updater) => {
  const current = clone(getMockStore());
  const next = updater(current) || current;
  saveMockStore(next);
  return cached;
};

export const resetMockStore = () => {
  saveMockStore(clone(defaultStore));
  return cached;
};
