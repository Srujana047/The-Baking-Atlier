import { useState, useRef } from "react";
import "./ReportButton.css";

/**
 * ReportButton Component
 * Allows users to report inappropriate content
 * 
 * Props:
 * - contentType: string - "post" or "comment"
 * - contentId: string - ID of the content being reported
 * - onReport: function - callback when report is submitted
 */
export default function ReportButton({ contentType, contentId, onReport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef(null);

  // TODO: add keyboard event handling (Escape to close)
  // TODO: add accessibility improvements (aria-labels, focus management)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      alert("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);

    try {
      await onReport({
        reportedType: contentType,
        reportedId: contentId,
        reason
      });

      setSubmitted(true);
      setReason("");

      // Auto-close after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setReason("");
    setSubmitted(false);
  };

  if (!isOpen) {
    return (
      <button
        className="report-trigger"
        onClick={() => setIsOpen(true)}
        title="Report this content"
        aria-label="Report content"
      >
        🚩
      </button>
    );
  }

  return (
    <div className="report-modal-overlay" onClick={handleClose}>
      <div
        className="report-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="report-header">
          <h3>Report {contentType}</h3>
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="report-success">
            <p>✓ Thank you for reporting this content.</p>
            <p className="muted">Our team will review it shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label htmlFor="reason-select">Reason for report:</label>
              <select
                id="reason-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Select a reason...</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="offensive">Offensive language</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* TODO: add detailed description textarea */}
            {/* <div className="form-group">
              <label htmlFor="description">Additional details (optional):</label>
              <textarea
                id="description"
                placeholder="Provide more context..."
                maxLength={500}
                rows={3}
              />
            </div> */}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !reason}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
