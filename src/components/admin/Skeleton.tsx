"use client";

// Animated table skeleton loader with configurable rows/cols
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="glass-table" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} style={{ padding: "16px 20px" }}>
                <div className="skeleton-line" style={{ width: `${60 + Math.random() * 30}%` }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} style={{ padding: "14px 20px" }}>
                  <div className="skeleton-line" style={{ width: `${40 + Math.random() * 50}%` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .skeleton-line {
          height: 14px;
          border-radius: 6px;
          background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// Animated stat card skeleton (4-grid layout)
export function StatSkeleton() {
  return (
    <div className="stats-grid-skeleton" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 32 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
          <div className="skeleton-circle" />
          <div style={{ flex: 1 }}>
            <div className="skeleton-line" style={{ width: "40%", height: 24, marginBottom: 8 }} />
            <div className="skeleton-line" style={{ width: "60%", height: 12 }} />
          </div>
        </div>
      ))}
      <style jsx>{`
        .skeleton-circle {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-line {
          height: 14px; border-radius: 6px;
          background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
