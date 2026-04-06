// Define the base URL from your backend guide
const API_BASE = "http://127.0.0.1:8000";

// --- TypeScript Interfaces ---
export type IssuerStatus = 'pending' | 'approved' | 'rejected';

export interface Issuer {
  id: string | number;
  name: string;
  email: string;
  status: IssuerStatus;
  wallet_address: string | null;
  // Adding a mock date field since your UI uses it, 
  // you might need to add this to your FastAPI backend later!
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
 * GET /admin/issuers?status=pending
 */
export const getIssuers = async (status?: IssuerStatus): Promise<Issuer[]> => {
  const url = status 
    ? `${API_BASE}/admin/issuers?status=${status}`
    : `${API_BASE}/admin/issuers`;

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
  const res = await fetch(`${API_BASE}/admin/issuers/${issuerId}/status`, {
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
  const res = await fetch(`${API_BASE}/admin/whitelist-wallet`, {
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