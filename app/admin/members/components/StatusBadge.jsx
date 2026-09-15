export default function StatusBadge({ status }) {
  const styles = {
    Pending: "border-yellow-200 bg-yellow-50 text-yellow-700",
    Accepted: "border-green-200 bg-green-50 text-green-700",
    Rejected: "border-red-200 bg-red-50 text-red-700",
  };

  const labels = {
    Pending: "Pending",
    Accepted: "Accepted",
    Rejected: "Rejected",
  };

  const currentStatus = status || "Pending";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[currentStatus] || styles.Pending
      }`}
    >
      {labels[currentStatus] || "Pending"}
    </span>
  );
}