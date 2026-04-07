const RAW_API_BASE = import.meta.env.VITE_API_URL;
const API_BASE = RAW_API_BASE.endsWith('/') ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE;

// --- 1. REFACTORED HEADERS ---
// Now accepts the token as a required parameter
const getAuthHeaders = (token: string) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export interface CertificateData {
  roll_number: string;
  student_name: string;
  course_program: string;
  passing_year: number;
  cgpa: number;
}

// UPDATED: Matches the new FastAPI response shape
export interface CertificateResponse {
  certificate_id: number;
  cid: string;
  hash: string;
  metadata_url: string;
  token_id: string | null;
}

/**
 * Issue a new certificate
 * Updated to accept token as the second argument
 */
export const createCertificate = async (data: CertificateData, token: string): Promise<CertificateResponse> => {
  const res = await fetch(`${API_BASE}/certificate/create`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create certificate on-chain.");
  }

  return res.json();
};

/**
 * Link the connected Polygon wallet to the Issuer account
 * Updated to accept token as the second argument
 */
export const linkWalletToBackend = async (walletAddress: string, token: string) => {
  const res = await fetch(`${API_BASE}/issuer/connect-wallet`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ wallet_address: walletAddress }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to link wallet to your account.");
  }

  return res.json();
};

/**
 * Fetch the latest wallet status from the backend
 * GET /issuer/wallet-status
 */
export const getWalletStatus = async (token: string) => {
  const res = await fetch(`${API_BASE}/issuer/wallet-status`, {
    method: 'GET',
    headers: getAuthHeaders(token), 
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch wallet status");
  }

  return res.json();
};

/**
 * Register a new Issuer (Institution)
 * POST /issuer/register
 * Public endpoint - no token required.
 */
export const registerIssuer = async (registrationData: any) => {
  const res = await fetch(`${API_BASE}/issuer/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (Array.isArray(err.detail)) {
      // FastAPI validation errors come as an array
      throw new Error(err.detail[0].msg);
    }
    throw new Error(err.detail || "Registration failed. Please try again.");
  }

  return res.json();
};

/**
 * Link a blockchain transaction hash (token_id) to a certificate in the database
 * POST /certificate/link-token
 */
export const linkCertificateToken = async (data: { certificate_id: number, token_id: string }, token: string) => {
  const res = await fetch(`${API_BASE}/certificate/link-token`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to link token to certificate in database.");
  }

  return res.json();
};

// ==========================================
// NEW HISTORY API ENDPOINTS & INTERFACES
// ==========================================

export interface CertificateRecord {
  certificate_id: number;
  cid: string;
  hash: string;
  token_id: string | null;
  created_at: string;
}

export interface CertificateHistoryResponse {
  issuer_id: number | string;
  total_generated: number;
  total_minted: number;
  limit: number;
  offset: number;
  certificates: CertificateRecord[];
}

/**
 * Fetch the issuance history for the logged-in institution
 * GET /certificate/history
 */
export const getCertificateHistory = async (token: string, limit = 50, offset = 0): Promise<CertificateHistoryResponse> => {
  const res = await fetch(`${API_BASE}/certificate/history?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch certificate history");
  }

  return res.json();
};