"use client";

export default function PublicLoading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">Loading...</p>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          gap: 20px;
          padding: 40px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--bg-alt);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          color: var(--text-light);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
