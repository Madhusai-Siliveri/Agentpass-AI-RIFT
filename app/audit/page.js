'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Download } from 'lucide-react';

const entries = [
  { time: '08:10', action: 'Credential issued',       badge: 'Issued',   Icon: CheckCircle2 },
  { time: '09:20', action: 'Verification completed',  badge: 'Verified', Icon: CheckCircle2 },
  { time: '11:05', action: 'Audit export generated',  badge: 'Exported', Icon: Download },
];

export default function AuditPage() {
  return (
    <main className="shell">
      {/* ── Hero ── */}
      <motion.section
        className="hero-card"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [.16,1,.3,1] }}
      >
        <span className="hero-corner hero-corner--tl" aria-hidden="true" />
        <span className="hero-corner hero-corner--tr" aria-hidden="true" />
        <span className="hero-corner hero-corner--bl" aria-hidden="true" />
        <span className="hero-corner hero-corner--br" aria-hidden="true" />

        <p className="eyebrow"><span className="eyebrow-dot" />Audit Trail</p>
        <h1>Review recent agent&nbsp;activity</h1>
        <p>Keep a transparent record of key security and operations events.</p>
        <div className="actions">
          <Link href="/"        className="btn btn-secondary">← Back home</Link>
          <Link href="/register" className="btn btn-primary">New registration</Link>
        </div>
      </motion.section>

      {/* ── Activity log ── */}
      <motion.section
        className="panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: [.16,1,.3,1] }}
      >
        <h2>Recent activities</h2>
        <div className="audit-table" role="list" aria-label="Audit log entries">
          {entries.map(({ time, action, badge, Icon }, i) => (
            <motion.div
              key={time}
              className="audit-row"
              role="listitem"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: [.16,1,.3,1] }}
              whileHover={{ x: 5 }}
            >
              <span className="audit-time">
                <Clock size={10} style={{ display:'inline-block', marginRight:4, verticalAlign:'middle' }} />
                {time}
              </span>
              <span className="audit-action">{action}</span>
              <span className="audit-badge">
                <Icon size={10} style={{ display:'inline-block', marginRight:4, verticalAlign:'middle' }} />
                {badge}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
