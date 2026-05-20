export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="spinner-shell" role="status" aria-live="polite">
      <div className="spinner-circle"></div>
      <p>{message}</p>
    </div>
  );
}
