export default function StatusPill({ status, onHand, reorderLevel }) {
  const validStatus = ["OUT", "LOW", "OK"];

  if (validStatus.includes(status)) {
    return <span>{status}</span>;
  }

  if (onHand === 0) {
    return <span>OUT</span>;
  }

  if (onHand > 0 && onHand <= reorderLevel) {
    return <span>LOW</span>;
  }

  return <span>OK</span>;
}
