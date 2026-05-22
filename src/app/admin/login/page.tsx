"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  // Login form state: email, password, error, and loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Submit handler — authenticates via next-auth credentials provider
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-section">
          <img src="/logo.svg" alt="VDCMF" className="logo" />
          <h1>Admin Login</h1>
          <p>Vision De Melbee Care Foundation</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vdcmf.org"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle" />
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--charcoal);
          padding: 24px;
        }

        .login-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 420px;
          overflow: hidden;
        }

        .logo-section {
          background: var(--charcoal);
          padding: 40px 40px 32px;
          text-align: center;
        }

        .logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 16px;
          border: 3px solid var(--gold);
        }

        .logo-section h1 {
          color: var(--gold);
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .logo-section p {
          color: var(--gray-light);
          font-size: 0.85rem;
        }

        .login-form {
          padding: 32px 40px 40px;
        }

        .login-btn {
          width: 100%;
          margin-top: 8px;
        }

        .error-message {
          background: #fef2f2;
          color: var(--error);
          border: 1px solid #fecaca;
          padding: 12px 16px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 16px;
        }

        @media (max-width: 480px) {
          .logo-section {
            padding: 32px 24px 24px;
          }
          .login-form {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
