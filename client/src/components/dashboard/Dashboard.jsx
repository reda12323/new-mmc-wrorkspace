import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "../login/firebase";
import "./Dashboard.css";
import "./LangSwitch.css";

// Same value as in LoginPage.jsx: set your own
const BRAND_NAME = "Your Company";

// Placeholder: replace with the real number of unread notifications
const NOTIFICATIONS = 2;

/* ---------- Languages ---------- */
const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" }, // Traditional Chinese (Taiwan)
];

// All the text of the page lives here. To change a word, edit it here.
const TRANSLATIONS = {
  en: {
    language: "Language",
    internalWorkspace: "Internal Workspace",
    search: "Search anything…",
    notifications: "Notifications",
    signOut: "Sign out",
    greetings: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    greetingSeparator: ", ",
    subtitle: "Your company workspace, all in one place.",
    dailyWork: "Daily work",
    departments: "Department collaboration",
    startHere: "Start here",
    exploreHub: "Explore Hub",
    items: {
      gmail: {
        title: "Corporate Gmail",
        description: "Business emails & external customer correspondence",
        action: "Open Gmail",
      },
      calendar: {
        title: "Google Calendar",
        description: "Meeting schedule & company events",
        action: "Open Calendar",
      },
      drive: {
        title: "Shared Drive",
        description: "Company files and resources",
        action: "Open Drive",
      },
      requests: {
        title: "Internal Requests",
        description: "Submit and track company requests",
        action: "Open requests",
      },
      sales: {
        title: "Sales Hub",
        description: "Quotation templates, sales contracts & CRM records",
      },
      finance: {
        title: "Finance Hub",
        description: "Expense reimbursement policies & corporate payment",
      },
      hr: {
        title: "HR & Admin",
        description: "Employee handbook, attendance rules & onboarding",
      },
      it: {
        title: "IT & Resources",
        description: "Workspace account permissions, WiFi setup & device guides",
      },
    },
  },

  zh: {
    language: "語言",
    internalWorkspace: "內部工作平台",
    search: "搜尋任何內容…",
    notifications: "通知",
    signOut: "登出",
    greetings: {
      morning: "早安",
      afternoon: "午安",
      evening: "晚上好",
    },
    greetingSeparator: "，",
    subtitle: "您的公司工作平台，一站式整合。",
    dailyWork: "日常工作",
    departments: "部門協作",
    startHere: "從這裡開始",
    exploreHub: "進入專區",
    items: {
      gmail: {
        title: "公司 Gmail",
        description: "商務郵件與外部客戶往來",
        action: "開啟 Gmail",
      },
      calendar: {
        title: "Google 日曆",
        description: "會議行程與公司活動",
        action: "開啟日曆",
      },
      drive: {
        title: "共用雲端硬碟",
        description: "公司檔案與資源",
        action: "開啟雲端硬碟",
      },
      requests: {
        title: "內部申請",
        description: "提交並追蹤公司申請",
        action: "開啟申請",
      },
      sales: {
        title: "業務專區",
        description: "報價範本、銷售合約與 CRM 紀錄",
      },
      finance: {
        title: "財務專區",
        description: "費用報銷政策與公司付款",
      },
      hr: {
        title: "人資與行政",
        description: "員工手冊、出勤規定與新進人員報到",
      },
      it: {
        title: "資訊與資源",
        description: "工作平台帳號權限、Wi-Fi 設定與設備使用指南",
      },
    },
  },
};

/* ---------- Cards (text comes from TRANSLATIONS by id) ---------- */
const DAILY_WORK = [
  { id: "gmail", icon: "mail", href: "https://mail.google.com" },
  { id: "calendar", icon: "calendar", href: "https://calendar.google.com" },
  { id: "drive", icon: "folder", href: "https://drive.google.com" },
  { id: "requests", icon: "fileCheck", href: "#", featured: true },
];

const DEPARTMENTS = [
  { id: "sales", icon: "chart", href: "#" },
  { id: "finance", icon: "coins", href: "#" },
  { id: "hr", icon: "users", href: "#" },
  { id: "it", icon: "laptop", href: "#" },
];

/* ---------- Icons (inline SVG, no extra dependency) ---------- */
const ICONS = {
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  grid: (
    <>
      {[5, 12, 19].flatMap((x) =>
        [5, 12, 19].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" fill="currentColor" stroke="none" />
        ))
      )}
    </>
  ),
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  calendar: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  folder: (
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  ),
  fileCheck: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  laptop: (
    <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
  ),
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {ICONS[name]}
    </svg>
  );
}

function LanguageSwitch({ lang, onChange, label }) {
  return (
    <div className="lang-switch" role="group" aria-label={label}>
      {LANGUAGES.map(({ code, label: text }) => (
        <button
          key={code}
          type="button"
          className={`lang-btn${lang === code ? " lang-btn--active" : ""}`}
          onClick={() => onChange(code)}
          aria-pressed={lang === code}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/* ---------- Helpers ---------- */
function getPeriod() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

// Remembers the chosen language in this browser
function getSavedLang() {
  try {
    return localStorage.getItem("lang") === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

// Opens external links in a new tab, ignores "#" placeholders
function linkProps(href) {
  if (href.startsWith("http")) {
    return { href, target: "_blank", rel: "noopener noreferrer" };
  }
  return { href, onClick: (e) => e.preventDefault() };
}

/* ---------- Page ---------- */
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState(getSavedLang);
  const menuRef = useRef(null);

  // Not signed in -> back to the login page
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/", { replace: true });
      setUser(u);
    });
  }, [navigate]);

  // Close the user menu when clicking outside of it
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  // Save the language and tell the browser which language the page is in
  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {
      // storage blocked: the choice just won't be remembered
    }
    document.documentElement.lang = lang === "zh" ? "zh-TW" : "en";
  }, [lang]);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  if (!user) return null; // still checking, or redirecting to login

  const t = TRANSLATIONS[lang];
  const fullName = user.displayName || user.email?.split("@")[0] || "there";
  const firstName = fullName.split(" ")[0];

  return (
    <div className="dash-page">
      <div className="dash-bg" aria-hidden="true" />

      {/* ---------- Top bar ---------- */}
      <header className="dash-topbar">
        <div className="dash-container dash-topbar-inner">
          <div className="dash-brand">
            <span className="dash-logo">{BRAND_NAME}</span>
            <span className="dash-brand-divider" aria-hidden="true" />
            <span className="dash-brand-name">{t.internalWorkspace}</span>
          </div>

          <label className="dash-search">
            <Icon name="search" size={18} />
            <input type="search" placeholder={t.search} aria-label={t.search} />
          </label>

          <div className="dash-actions">
            <LanguageSwitch lang={lang} onChange={setLang} label={t.language} />

            <button type="button" className="dash-bell" aria-label={t.notifications}>
              <Icon name="bell" size={22} />
              {NOTIFICATIONS > 0 && (
                <span className="dash-badge">{NOTIFICATIONS}</span>
              )}
            </button>

            <div className="dash-user" ref={menuRef}>
              <button
                type="button"
                className="dash-user-btn"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="dash-avatar">{getInitials(fullName)}</span>
                <span className="dash-user-name">{fullName}</span>
                <Icon name="chevronDown" size={16} />
              </button>

              {menuOpen && (
                <div className="dash-menu" role="menu">
                  <p className="dash-menu-email">{user.email}</p>
                  <button type="button" role="menuitem" onClick={handleLogout}>
                    {t.signOut}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="dash-main">
        {/* ---------- Hero ---------- */}
        <section className="dash-hero">
          <div className="dash-container dash-hero-text">
            <h1>
              {t.greetings[getPeriod()]}
              {t.greetingSeparator}
              {firstName}
            </h1>
            <p>{t.subtitle}</p>
          </div>
        </section>

        <div className="dash-container dash-content">
          {/* ---------- Daily work ---------- */}
          <section className="dash-section">
            <h2 className="dash-section-title">
              <Icon name="grid" size={20} />
              {t.dailyWork}
            </h2>

            <div className="dash-grid">
              {DAILY_WORK.map((item) => {
                const text = t.items[item.id];
                return (
                  <article
                    key={item.id}
                    className={`work-card${item.featured ? " work-card--featured" : ""}`}
                  >
                    {item.featured && <span className="work-badge">{t.startHere}</span>}
                    <span className="work-icon">
                      <Icon name={item.icon} size={24} />
                    </span>
                    <h3>{text.title}</h3>
                    <p>{text.description}</p>
                    <a className="work-btn" {...linkProps(item.href)}>
                      {text.action}
                      <Icon name="arrowRight" size={16} />
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ---------- Department collaboration ---------- */}
          <section className="dash-section">
            <h2 className="dash-section-title">
              <Icon name="users" size={20} />
              {t.departments}
            </h2>

            <div className="dash-grid">
              {DEPARTMENTS.map((dept) => {
                const text = t.items[dept.id];
                return (
                  <article key={dept.id} className="hub-card">
                    <span className="hub-icon">
                      <Icon name={dept.icon} size={26} />
                    </span>
                    <h3>{text.title}</h3>
                    <p>{text.description}</p>
                    <a className="hub-link" {...linkProps(dept.href)}>
                      {t.exploreHub}
                      <Icon name="arrowRight" size={14} />
                    </a>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}