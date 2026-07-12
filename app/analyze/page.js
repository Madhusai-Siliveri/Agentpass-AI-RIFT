'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Target, Activity, Lock, FileSearch, Zap } from 'lucide-react';

const initialForm = {
  agentName: 'Ops Agent',
  purpose: 'Summarize finance tickets',
  description: 'Reads customer data, drafts responses, and escalates blockers.',
  permissions: 'read:ticket, write:notes',
  recentActivities: 'Reviewed five tickets and approved one escalation',
};

export default function AnalyzePage() {
  const [form, setForm]     = useState(initialForm);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-trust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  const meterStyle = useMemo(() => {
    if (!report) return 'linear-gradient(90deg,var(--cyan-dim),var(--purple))';
    if (report.trust_score >= 85) return 'linear-gradient(90deg,#4EA6FF,#6BFFB5)';
    if (report.trust_score >= 65) return 'linear-gradient(90deg,#FFD76A,#FF9D4A)';
    return 'linear-gradient(90deg,#FF6B8A,#FF4444)';
  }, [report]);

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

        <p className="eyebrow"><span className="eyebrow-dot" />AI Trust Analyzer</p>
        <h1>Professional cybersecurity-grade trust&nbsp;review</h1>
        <p>
          Evaluate agent intent, permissions, and recent activity using
          AI-assisted reasoning with a graceful fallback mode.
        </p>
        <div className="actions">
          <Link href="/"        className="btn btn-secondary">← Back home</Link>
          <Link href="/register" className="btn btn-primary">Register agent</Link>
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
          <form onSubmit={handleSubmit}>
            <h2>Analysis input</h2>

            <label>
              Agent name
              <input value={form.agentName}
                onChange={(e) => setForm({ ...form, agentName: e.target.value })} required />
            </label>
            <label>
              Purpose
              <input value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
            </label>
            <label>
              Description
              <textarea value={form.description} rows={3}
                onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </label>
            <label>
              Permissions
              <input value={form.permissions}
                onChange={(e) => setForm({ ...form, permissions: e.target.value })} required />
            </label>
            <label>
              Recent activities
              <textarea value={form.recentActivities} rows={3}
                onChange={(e) => setForm({ ...form, recentActivities: e.target.value })} required />
            </label>

            <motion.button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              whileHover={{ y: -3, scale: 1.025 }}
              whileTap={{ scale: .975 }}
            >
              <Zap size={15} strokeWidth={2} />
              {loading ? 'Analyzing…' : 'Run AI analysis'}
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="status-note error"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="status-note-icon">⚠</span>{error}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Overview */}
        <motion.aside
          className="panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [.16,1,.3,1] }}
        >
          <h2>Analysis overview</h2>

          <div className="metric-card" style={{ marginBottom: '12px' }}>
            <span>Live signal</span>
            <strong>{report ? `${report.trust_score}/100` : 'Awaiting input'}</strong>
          </div>

          <div className="metric-card">
            <span>Fallback mode</span>
            <strong>{report?.source === 'fallback' ? 'Enabled' : 'AI ready'}</strong>
          </div>

          {/* Scanner */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="scanner-wrap"
                initial={{ opacity: 0, scale: .9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: .9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="scanner-ring" aria-hidden="true" />
                <p className="scanner-text">AI analyzing…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      </motion.section>

      {/* ── Trust report ── */}
      <AnimatePresence>
        {report && (
          <motion.section
            className="panel trust-report"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.55, ease: [.16,1,.3,1] }}
          >
            <h2>Trust report</h2>

            <div className="metric-grid">
              <motion.article
                className="metric-card"
                initial={{ opacity: 0, scale: .92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span>Trust score</span>
                <strong>{report.trust_score}/100</strong>
              </motion.article>
              <motion.article
                className="metric-card"
                initial={{ opacity: 0, scale: .92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span>Confidence</span>
                <strong>{report.confidence_level}</strong>
              </motion.article>
              <motion.article
                className="metric-card"
                initial={{ opacity: 0, scale: .92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span>Security posture</span>
                <strong>{report.risk_level}</strong>
              </motion.article>
            </div>

            <div className="section-surface">
              <h3>Security explanation</h3>
              <p>{report.security_explanation}</p>
            </div>

            <div className="section-surface">
              <h3>Trust meter — {report.trust_score}/100</h3>
              <div className="meter-track">
                <motion.div
                  className="meter-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${report.trust_score}%` }}
                  transition={{ duration: 1.4, ease: [.4,0,.2,1] }}
                  style={{ background: meterStyle }}
                />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
