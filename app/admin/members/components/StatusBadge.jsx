export default function StatusBadge({ status }) {
  const styles = {
    pending: "border-yellow-200 bg-yellow-50 text-yellow-700",
    accepted: "border-green-200 bg-green-50 text-green-700",
    rejected: "border-red-200 bg-red-50 text-red-700",
  };

  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  const currentStatus = status || "pending";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[currentStatus] || styles.pending
      }`}
    >
      {labels[currentStatus] || "Pending"}
    </span>
  );
}