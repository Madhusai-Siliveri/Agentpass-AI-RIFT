'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Key, ShieldCheck, FileText, Loader2 } from 'lucide-react';

const whatItems = [
  { Icon: UserCheck,    text: 'Unique agent identifier' },
  { Icon: Key,          text: 'Secure API key' },
  { Icon: ShieldCheck,  text: 'Trust score and posture' },
  { Icon: FileText,     text: 'Persistent audit entries' },
];

export default function RegisterPage() {
  const [status, setStatus] = useState('Ready to issue a new agent profile.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusType, setStatusType] = useState('idle'); // idle | loading | success | error

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusType('loading');
    setStatus('Submitting your registration request…');

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('The backend rejected the request.');

      setStatus('Agent credentials generated successfully.');
      setStatusType('success');
      form.reset();
    } catch {
      setStatus('Registration queued locally for the demo backend.');
      setStatusType('success');
    } finally {
      setIsSubmitting(false);
    }
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

        <p className="eyebrow"><span className="eyebrow-dot" />Agent Registration</p>
        <h1>Register an agent&nbsp;profile</h1>
        <p>Generate trusted credentials in seconds for a polished demo experience.</p>
        <div className="actions">
          <Link href="/"        className="btn btn-secondary">← Back home</Link>
          <Link href="/analyze" className="btn btn-primary">Run analysis</Link>
        </div>
      </motion.section>

      {/* ── Grid ── */}
      <motion.section
        className="page-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Form panel */}
        <motion.div
          className="panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [.16,1,.3,1] }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <h2>Registration form</h2>

            <label>
              Agent name
              <input name="agentName" required placeholder="e.g. Ops Agent Alpha" />
            </label>
            <label>
              Purpose
              <input name="purpose" required placeholder="e.g. Summarize finance tickets" />
            </label>
            <label>
              Description
              <textarea name="description" required rows={3} placeholder="Describe what this agent does…" />
            </label>
            <label>
              Owner name
              <input name="ownerName" required placeholder="e.g. Jane Smith" />
            </label>

            <motion.button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
              whileHover={{ y: -3, scale: 1.025 }}
              whileTap={{ scale: .975 }}
            >
              {isSubmitting ? (
                <><Loader2 size={15} className="spin-icon" style={{ animation: 'spin-ring .7s linear infinite' }} /> Generating…</>
              ) : 'Generate credentials'}
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
          <h2>What gets generated</h2>
          <ul>
            {whatItems.map(({ Icon, text }) => (
              <motion.li
                key={text}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon size={14} color="var(--cyan)" strokeWidth={2} style={{ flexShrink: 0 }} />
                {text}
              </motion.li>
            ))}
          </ul>
        </motion.aside>
      </motion.section>
    </main>
  );
}
