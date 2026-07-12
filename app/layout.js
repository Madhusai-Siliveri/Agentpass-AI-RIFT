import './globals.css';
import Link from 'next/link';
import { MobileNav } from '../components/mobile-nav';

export const metadata = {
  title: 'AgentPass AI — Identity & Trust OS',
  description: 'Secure AI agent identity and trust platform',
};

const navLinks = [
  { href: '/',         label: 'Overview' },
  { href: '/register', label: 'Identity' },
  { href: '/analyze',  label: 'Trust' },
  { href: '/verify',   label: 'Verify' },
  { href: '/audit',    label: 'Audit' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* ── Layered background environment ── */}
        <div className="bg-environment" aria-hidden="true">
          <div className="bg-grid" />
          <div className="bg-scanlines" />
          <div className="bg-scan-beam" />
          <div className="bg-orb-1" />
          <div className="bg-orb-2" />
          <div className="bg-orb-3" />
        </div>

        <div className="app-shell">
          {/* ── Topbar ── */}
          <header className="topbar">
            <Link href="/" className="brand" aria-label="AgentPass AI home">
              <span className="brand-mark" aria-hidden="true">
                {/* Chip / CPU icon */}
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2H15V4H16C17.1 4 18 4.9 18 6V7H20V9H18V11H20V13H18V15H20V17H18V18C18 19.1 17.1 20 16 20H15V22H13V20H11V22H9V20H8C6.9 20 6 19.1 6 18V17H4V15H6V13H4V11H6V9H4V7H6V6C6 4.9 6.9 4 8 4H9V2ZM8 6V18H16V6H8ZM10 8H14V16H10V8Z"/>
                </svg>
              </span>
              AgentPass&nbsp;AI
            </Link>

            <nav className="topbar-nav" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="sys-status" aria-live="polite">
              <span className="status-pulse" aria-hidden="true" />
              Systems Online
            </div>
          </header>

          {children}
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
