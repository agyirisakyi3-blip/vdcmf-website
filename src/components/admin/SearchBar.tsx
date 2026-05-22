"use client";

// Controlled search input with clear button
interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="search-wrap">
      <i className="fas fa-search" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
          <i className="fas fa-times" />
        </button>
      )}
      <style jsx>{`
        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-wrap i {
          position: absolute;
          left: 14px;
          color: #9ca3af;
          font-size: 0.85rem;
          pointer-events: none;
        }
        .search-input {
          width: 280px;
          padding: 10px 14px 10px 38px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 12px;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(8px);
          font-size: 0.85rem;
          font-family: "DM Sans", sans-serif;
          color: #1a1a2e;
          outline: none;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          border-color: rgba(212,175,55,0.4);
          background: rgba(255,255,255,0.7);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
        }
        .search-input::placeholder { color: #9ca3af; }
        .search-clear {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          font-size: 0.8rem;
        }
        .search-clear:hover { color: #6b7280; }
      `}</style>
    </div>
  );
}
