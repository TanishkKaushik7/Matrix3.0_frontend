// --- 1. SYNC THE URL ---
// Using the .env variable ensures Admin and Login hit the same Tailscale endpoint
const RAW_API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Clean the base URL: Remove any trailing slashes to prevent //auth/login issues
const API_BASE = RAW_API_BASE.endsWith('/') ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE;

// --- TypeScript Interfaces ---
export type IssuerStatus = 'pending' | 'approved' | 'rejected';

export interface Issuer {
  id: string | number;
  name: string;
  email: string;
  status: IssuerStatus;
  wallet_address: string | null;
  created_at?: string; 
}

// --- Helper for Headers ---
const getAuthHeaders = () => {
  const token = localStorage.getItem('bn_auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// --- API Methods ---

/**
 * Fetch all issuers, optionally filtered by status
 * Uses template literals carefully to avoid double slashes
 */
export const getIssuers = async (status?: IssuerStatus): Promise<Issuer[]> => {
  const endpoint = status ? `/admin/issuers?status=${status}` : '/admin/issuers';
  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch issuers");
  }

  return res.json();
};

/**
 * Update an issuer's approval status
 * PATCH /admin/issuers/{issuer_id}/status
 */
export const updateIssuerStatus = async (issuerId: string | number, status: IssuerStatus) => {
  const url = `${API_BASE}/admin/issuers/${issuerId}/status`;
  
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to update status to ${status}`);
  }

  return res.json();
};

/**
 * Whitelist an issuer's Polygon wallet address
 * POST /admin/whitelist-wallet
 */
export const whitelistWallet = async (issuerId: string | number, walletAddress: string) => {
  const url = `${API_BASE}/admin/whitelist-wallet`;

  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      issuer_id: issuerId,
      wallet_address: walletAddress
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to whitelist wallet");
  }

  return res.json();
};