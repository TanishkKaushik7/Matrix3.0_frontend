// Status indicators (Pending, Approved, Verified)
export default function Badge({ status }: { status: string }) {
  return <span>{status}</span>;
}
