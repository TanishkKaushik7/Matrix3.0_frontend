const RAW_API_BASE = import.meta.env.VITE_API_URL;
const API_BASE = RAW_API_BASE.endsWith('/') ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE;

export interface CertificatePayload {
  roll_number: string;
  student_name: string;
  course_program: string;
  passing_year: number;
  cgpa: number;
}

export interface VerifyResponse {
  token_id: string;
  certificate_id: number;
  cid: string;
  hash: string;
  metadata_url: string;
  created_at: string;
  issuer_id: number;
  issuer_name: string;
  metadata_accessible: boolean;
  metadata_hash: string;
  metadata_hash_matches: boolean;
  recomputed_hash: string;
  recomputed_hash_matches: boolean;
  certificate_payload: CertificatePayload;
  is_verified: boolean;
}

/**
 * Verify a certificate by its transaction hash (token_id)
 * GET /certificate/verify/{token_id}
 */
export const verifyCertificate = async (tokenId: string): Promise<VerifyResponse> => {
  const res = await fetch(`${API_BASE}/certificate/verify/${tokenId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Certificate not found or invalid.");
  }

  return res.json();
};