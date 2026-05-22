"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">!</div>
        <h1 className="error-heading">Something went wrong</h1>
        <p className="error-message">{error.message}</p>
        <button className="error-btn" onClick={reset}>
          Try Again
        </button>
      </div>

      <style jsx>{`
        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px;
          background: #F2F4F6;
          font-family: 'DM Sans', sans-serif;
        }

        .error-card {
          background: #fff;
          border: 1px solid #EDEDED;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
          padding: 48px;
          text-align: center;
          max-width: 480px;
          width: 100%;
        }

        .error-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #D4AF37;
          color: #fff;
          font-size: 1.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .error-heading {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1C1C1C;
          margin-bottom: 12px;
        }

        .error-message {
          font-size: 0.95rem;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .error-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 32px;
          border: none;
          border-radius: 8px;
          background: #D4AF37;
          color: #1C1C1C;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .error-btn:hover {
          background: #C5A22E;
        }
      `}</style>
    </div>
  );
}
