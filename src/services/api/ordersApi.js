import { API_BASE_URL, getAuthHeader } from './apiConfig';
import { USE_MOCKS } from '../mockMode';
import { getMockStore, updateMockStore } from './mockStore';

/**
 * @file ordersApi.js
 * @description REST API calls for ordering: place new, delete, and find.
 */

export const placeOrder = async ({ symbol, type, side, price, quantity }) => {
    if (USE_MOCKS) {
        const orderId = `MOCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        updateMockStore((store) => {
            const normalizedQty = Number(quantity) || 0;
            const normalizedPrice = price != null ? Number(price) : null;
            const nextOrder = {
                id: orderId,
                symbol,
                type,
                side,
                price: normalizedPrice,
                quantity: normalizedQty,
                status: 'open',
            };
            store.orders = [nextOrder, ...store.orders].slice(0, 50);

            if (type === 'market') {
                const storeSnapshot = getMockStore();
                const fallbackPrice = storeSnapshot.holdings.find(h => h.symbol === symbol)?.current_price || 100;
                store.trades = [
                    {
                        id: `TRD-${Date.now()}`,
                        symbol,
                        side,
                        price: normalizedPrice ?? fallbackPrice,
                        quantity: normalizedQty,
                        timestamp: Date.now(),
                    },
                    ...store.trades,
                ].slice(0, 200);
            }

            return store;
        });

        return { success: true, orderId };
    }
    try {
        const payload = { symbol, type, side, quantity };
        if (price) payload.price = parseFloat(price);
        
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, orderId: data.order_id };
        } else {
            return { success: false, error: data.message || 'Failed to place order' };
        }
    } catch (err) {
        console.error('PlaceOrder API Error:', err);
        return { success: false, error: 'Network failure' };
    }
};

export const cancelOrder = async (orderId) => {
    if (USE_MOCKS) {
        updateMockStore((store) => {
            store.orders = store.orders.filter((o) => o.id !== orderId);
            return store;
        });
        return { success: true };
    }
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: data.message || 'Failed to cancel order' };
        }
    } catch (err) {
        console.error('CancelOrder API Error:', err);
        return { success: false, error: 'Network failure' };
    }
};

export const fetchOrders = async (params = {}) => {
    if (USE_MOCKS) {
        const store = getMockStore();
        return { success: true, orders: store.orders };
    }
    try {
        const qs = new URLSearchParams(params).toString();
        const urlStr = qs ? `${API_BASE_URL}/orders?${qs}` : `${API_BASE_URL}/orders`;

        const response = await fetch(urlStr, {
            method: 'GET',
            headers: getAuthHeader()
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, orders: data };
        } else {
            return { success: false, error: 'Failed to fetch orders' };
        }
    } catch (err) {
        console.error('FetchOrders API Error:', err);
        return { success: false, error: 'Network failure' };
    }
};

export const fetchTrades = async ({ symbol, limit } = {}) => {
    if (USE_MOCKS) {
        const store = getMockStore();
        const filtered = symbol
            ? store.trades.filter((trade) => trade.symbol === symbol)
            : store.trades;
        const capped = limit ? filtered.slice(0, limit) : filtered;
        return { success: true, trades: capped };
    }
    try {
        const params = new URLSearchParams();
        if (symbol) params.set('symbol', symbol);
        if (limit)  params.set('limit', limit);
        const qs = params.toString();
        const url = qs ? `${API_BASE_URL}/my/trades?${qs}` : `${API_BASE_URL}/my/trades`;

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeader()
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, trades: Array.isArray(data) ? data : [] };
        } else {
            return { success: false, error: 'Failed to fetch trades' };
        }
    } catch (err) {
        console.error('FetchTrades API Error:', err);
        return { success: false, error: 'Network failure' };
    }
};
