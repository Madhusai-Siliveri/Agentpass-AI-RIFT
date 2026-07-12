'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ShieldAlert, ScanLine, Lock } from 'lucide-react';

const checkItems = [
  { Icon: Fingerprint, text: 'Identity record presence' },
  { Icon: ShieldAlert, text: 'Trust and risk posture'   },
  { Icon: Lock,        text: 'Permission scope and audit coverage' },
];

export default function VerifyPage() {
  const [status,    setStatus]    = useState('Enter an agent identifier to verify its trust posture.');
  const [statusType, setStatusType] = useState('idle'); // idle | success | error

  function handleSubmit(event) {
    event.preventDefault();
    const form  = event.currentTarget;
    const input = new FormData(form).get('agentId');
    if (!input) {
      setStatus('Please enter an agent identifier.');
      setStatusType('error');
      return;
    }
    setStatus(`Verification request prepared for ${input}.`);
    setStatusType('success');
  }

  const noteClass = statusType === 'success' ? 'status-note success'
                  : statusType === 'error'   ? 'status-note error'
                  : 'status-note';
  const noteIcon  = statusType === 'success' ? '✓'
                  : statusType === 'error'   ? '⚠'
                  : '◈';

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

        <p className="eyebrow"><span className="eyebrow-dot" />Verification</p>
        <h1>Verify an agent&nbsp;profile</h1>
        <p>Confirm identity, trust level, and policy posture for a known agent.</p>
        <div className="actions">
          <Link href="/"        className="btn btn-secondary">← Back home</Link>
          <Link href="/analyze" className="btn btn-primary">Open analysis</Link>
        </div>
      </motion.section>

      {/* ── Grid ── */}
      <motion.section
        className="page-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Form */}
        <motion.div
          className="panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [.16,1,.3,1] }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <h2>Check an agent</h2>

            <label>
              Agent identifier
              <input name="agentId" required placeholder="agent-1001" />
            </label>

            <motion.button
              className="btn btn-primary"
              type="submit"
              whileHover={{ y: -3, scale: 1.025 }}
              whileTap={{ scale: .975 }}
            >
              <ScanLine size={15} strokeWidth={2} />
              Verify identity
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.p
                key={status}
                className={noteClass}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span className="status-note-icon">{noteIcon}</span>
                {status}
              </motion.p>
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Info aside */}
        <motion.aside
          className="panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [.16,1,.3,1] }}
        >
          <h2>What this checks</h2>
          <ul>
            {checkItems.map(({ Icon, text }) => (
              <motion.li
                key={text}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon size={13} color="var(--cyan)" strokeWidth={2} style={{ flexShrink: 0 }} />
                {text}
              </motion.li>
            ))}
          </ul>
        </motion.aside>
      </motion.section>
    </main>
  );
}
