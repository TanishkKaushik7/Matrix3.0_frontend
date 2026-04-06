// --- 1. SYNC THE URL ---
// Using the .env variable ensures Admin and Login hit the same endpoint
const RAW_API_BASE = import.meta.env.VITE_API_URL;

// Clean the base URL: Remove any trailing slashes
const API_BASE = RAW_API_BASE.endsWith('/') ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE;

// --- TypeScript Interfaces ---
export type IssuerStatus = 'pending' | 'approved' | 'rejected';

// UPDATED: Perfectly matches the FastAPI JSON response
export interface Issuer {
  id: string | number;
  college_name: string;
  college_address: string;
  college_id: string;
  document: string;
  document_id: string;
  phone_number: string;
  email: string;
  status: IssuerStatus;
  wallet_address: string | null;
}

// --- Helper for Headers ---
// SECURED: No longer reads from localStorage. Requires the token from RAM.
const getAuthHeaders = (token: string) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// --- API Methods ---

/**
 * Fetch all issuers, optionally filtered by status
 * SECURED: Now requires the JWT token as the first argument
 */
export const getIssuers = async (token: string, status?: IssuerStatus): Promise<Issuer[]> => {
  const endpoint = status ? `/admin/issuers?status=${status}` : '/admin/issuers';
  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token), // Pass token to headers
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
 * SECURED: Now requires the JWT token
 */
export const updateIssuerStatus = async (issuerId: string | number, status: IssuerStatus, token: string) => {
  const url = `${API_BASE}/admin/issuers/${issuerId}/status`;
  
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(token), // Pass token to headers
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
 * SECURED: Now requires the JWT token
 */
export const whitelistWallet = async (issuerId: string | number, walletAddress: string, token: string) => {
  const url = `${API_BASE}/admin/whitelist-wallet`;

  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(token), // Pass token to headers
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