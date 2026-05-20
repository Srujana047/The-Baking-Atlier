export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="error-banner-card" role="alert">
      <span>{message}</span>
      {onClose ? (
        <button type="button" onClick={onClose} aria-label="Close error">
          ✕
        </button>
      ) : null}
    </div>
  );
}
