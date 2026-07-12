'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const links = [
  { href: '/',         label: 'Overview' },
  { href: '/register', label: 'Identity' },
  { href: '/analyze',  label: 'Trust'    },
  { href: '/verify',   label: 'Verify'   },
  { href: '/audit',    label: 'Audit'    },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav" aria-label="Product navigation">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`mobile-nav-link${isActive ? ' active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <motion.span
                layoutId="nav-pill"
                className="nav-active-bg"
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: 9999,
                  background: 'linear-gradient(135deg,rgba(110,243,255,.2) 0%,rgba(139,92,255,.15) 100%)',
                  border: '1px solid rgba(0,220,255,.3)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
