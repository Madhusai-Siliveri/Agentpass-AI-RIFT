'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, BarChart3, ClipboardList } from 'lucide-react';

const features = [
  {
    title: 'Identity',
    description: 'Give each AI agent a clear, trustworthy profile for human review.',
    Icon: Shield,
    color: 'rgba(110,243,255,.9)',
    glow:  'rgba(110,243,255,.35)',
  },
  {
    title: 'Trust',
    description: 'Surface confidence, risk, and transparency signals in a simple dashboard.',
    Icon: BarChart3,
    color: 'rgba(139,92,255,.9)',
    glow:  'rgba(139,92,255,.35)',
  },
  {
    title: 'Audit',
    description: 'Keep a readable record of actions and approvals for accountability.',
    Icon: ClipboardList,
    color: 'rgba(78,166,255,.9)',
    glow:  'rgba(78,166,255,.35)',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [.16,1,.3,1] } },
};

export default function HomePage() {
  return (
    <main className="shell">
      {/* ── Hero ── */}
      <motion.section
        className="hero-card"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [.16,1,.3,1] }}
      >
        {/* Decorative corner marks */}
        <span className="hero-corner hero-corner--tl" aria-hidden="true" />
        <span className="hero-corner hero-corner--tr" aria-hidden="true" />
        <span className="hero-corner hero-corner--bl" aria-hidden="true" />
        <span className="hero-corner hero-corner--br" aria-hidden="true" />

        <p className="eyebrow">
          <span className="eyebrow-dot" />
          AI Identity Operating System
        </p>
        <h1>A cleaner way to understand&nbsp;and trust AI&nbsp;agents.</h1>
        <p>
          AgentPass AI presents identity, trust, and auditability through a
          polished web experience built for clarity and confidence.
        </p>

        <div className="actions">
          <Link href="/register" className="btn btn-primary">Explore Identity</Link>
          <Link href="/analyze"  className="btn btn-secondary">View Trust Flow</Link>
        </div>
      </motion.section>

      {/* ── Feature cards ── */}
      <motion.section
        className="feature-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        aria-label="Core capabilities"
      >
        {features.map(({ title, description, Icon, color, glow }) => (
          <motion.article
            key={title}
            className="feature-card"
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <span className="card-corner" aria-hidden="true" />
            <div
              className="feature-icon"
              style={{ boxShadow: `0 4px 24px ${glow}, inset 0 1px 0 rgba(255,255,255,.1)` }}
            >
              <Icon size={22} color={color} strokeWidth={1.6} />
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
          </motion.article>
        ))}
      </motion.section>
    </main>
  );
}
