import "./LoginPage.css";
import { AuthWeb } from "./AuthWeb";

// Set your own app's details here
const BRAND_NAME = "Your Company";
const PORTAL_NAME = "Internal Portal";

function ShieldIcon() {
  return (
    <svg
      className="shield-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />

      <main className="login-main">
        <section className="login-card">
          <div className="login-logo">{BRAND_NAME}</div>

          <h1 className="login-title">Welcome to {BRAND_NAME} Workspace</h1>
          <p className="login-subtitle">
            Sign in with your company account to continue
          </p>

          <AuthWeb />

          <div className="login-divider">
            <span>or</span>
          </div>

          <p className="login-note">
            <ShieldIcon />
            <span>
              Only authorized company accounts
              <br />
              can access this workspace
            </span>
          </p>
        </section>
      </main>

      <footer className="login-footer">
        © 2026 {BRAND_NAME} &nbsp;|&nbsp; {PORTAL_NAME}
      </footer>
    </div>
  );
}