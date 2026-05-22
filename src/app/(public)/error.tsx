"use client";

export default function PublicError({
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
          min-height: calc(100vh - 80px);
          padding: 40px;
        }

        .error-card {
          background: var(--white);
          border: 1px solid var(--bg-alt);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
          padding: 48px;
          text-align: center;
          max-width: 480px;
          width: 100%;
        }

        .error-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--white);
          font-size: 1.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .error-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 12px;
        }

        .error-message {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: var(--text-light);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .error-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 36px;
          border: none;
          border-radius: var(--radius-full);
          background: var(--accent);
          color: var(--dark);
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .error-btn:hover {
          background: var(--accent-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.35);
        }
      `}</style>
    </div>
  );
}
