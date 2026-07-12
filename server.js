const express = require('express');
const { Pool } = require('pg');
const { analyzeTrust } = require('./lib/trustAnalyzer.cjs');

const app = express();
const PORT = process.env.PORT || 3000;
const memoryAgents = [];

function buildDemoAgentSeed() {
  return [
    {
      agent_id: 'agent-1001',
      agent_name: 'Northwind Intake Bot',
      owner_name: 'Mina Chen',
      purpose: 'Triages support tickets and drafts customer replies',
      description: 'Monitors incoming support requests, classifies urgency, and drafts polished replies for the service team.',
      api_key: 'ak_nw7x94m2q8pr',
      certificate: 'CERT-NW-2026-047',
      trust_score: 94,
      permissions: ['read:ticket', 'write:response', 'approve:escalation', 'export:audit'],
      audit_logs: [
        { timestamp: '2026-07-11T10:03:12Z', action: 'Verified identity request', status: 'Approved' },
        { timestamp: '2026-07-11T09:56:41Z', action: 'Requested permission refresh', status: 'Pending' },
        { timestamp: '2026-07-11T09:12:07Z', action: 'Exported audit log', status: 'Completed' },
      ],
    },
    {
      agent_id: 'agent-2002',
      agent_name: 'Helix Compliance Agent',
      owner_name: 'Jon Alvarez',
      purpose: 'Reviews vendor policies and flags policy drift',
      description: 'Parses compliance policy updates and alerts the operations team when controls change.',
      api_key: 'ak_hx3p8r1w7d4m',
      certificate: 'CERT-HX-2026-018',
      trust_score: 88,
      permissions: ['read:policy', 'write:alert', 'review:controls'],
      audit_logs: [
        { timestamp: '2026-07-10T13:22:40Z', action: 'Flagged missing approval chain', status: 'Needs Review' },
        { timestamp: '2026-07-10T11:04:12Z', action: 'Synced policy archive', status: 'Completed' },
      ],
    },
    {
      agent_id: 'agent-3003',
      agent_name: 'Cedar Billing Copilot',
      owner_name: 'Amina Rahman',
      purpose: 'Audits invoices and detects duplicate billing events',
      description: 'Cross-checks invoice data against contract terms and raises anomalies before payments are approved.',
      api_key: 'ak_cd8m2w6q1p4v',
      certificate: 'CERT-CD-2026-033',
      trust_score: 81,
      permissions: ['read:invoice', 'write:anomaly', 'approve:payment'],
      audit_logs: [
        { timestamp: '2026-07-09T08:47:11Z', action: 'Blocked duplicate payment', status: 'Blocked' },
        { timestamp: '2026-07-09T07:12:28Z', action: 'Reviewed invoice exceptions', status: 'Approved' },
      ],
    },
    {
      agent_id: 'agent-4004',
      agent_name: 'Atlas Security Scout',
      owner_name: 'Derek Osei',
      purpose: 'Monitors network telemetry and highlights suspicious behaviour',
      description: 'Correlates endpoint events with alerting rules and escalates risk-based findings in near real time.',
      api_key: 'ak_at7l2k9v4r6n',
      certificate: 'CERT-AT-2026-052',
      trust_score: 96,
      permissions: ['read:telemetry', 'write:alert', 'approve:containment'],
      audit_logs: [
        { timestamp: '2026-07-11T06:16:05Z', action: 'Triggered endpoint isolation', status: 'Approved' },
        { timestamp: '2026-07-10T22:08:19Z', action: 'Escalated unusual login pattern', status: 'Completed' },
      ],
    },
    {
      agent_id: 'agent-5005',
      agent_name: 'Lumen Knowledge Assistant',
      owner_name: 'Priya Singh',
      purpose: 'Answers internal policy questions with approved knowledge sources',
      description: 'Searches documentation and recommends verified next steps for employee support requests.',
      api_key: 'ak_lm4q1t8v2x6c',
      certificate: 'CERT-LM-2026-071',
      trust_score: 79,
      permissions: ['read:knowledge', 'write:summary', 'review:faq'],
      audit_logs: [
        { timestamp: '2026-07-08T16:31:44Z', action: 'Answered product policy query', status: 'Approved' },
        { timestamp: '2026-07-08T14:09:05Z', action: 'Suggested knowledge article update', status: 'Pending' },
      ],
    },
    {
      agent_id: 'agent-6006',
      agent_name: 'Orchid Procurement Bot',
      owner_name: 'Liam Torres',
      purpose: 'Matches purchase requests with approved suppliers and quotes',
      description: 'Evaluates supplier records and flags invoices that do not match negotiated contract terms.',
      api_key: 'ak_or2h5p9w8t3m',
      certificate: 'CERT-OR-2026-089',
      trust_score: 83,
      permissions: ['read:purchase', 'write:quote', 'review:supplier'],
      audit_logs: [
        { timestamp: '2026-07-07T12:05:20Z', action: 'Matched approved supplier quote', status: 'Completed' },
        { timestamp: '2026-07-07T10:40:09Z', action: 'Flagged pricing variance', status: 'Needs Review' },
      ],
    },
    {
      agent_id: 'agent-7007',
      agent_name: 'Harbor Data Steward',
      owner_name: 'Nadia Brooks',
      purpose: 'Maintains retention schedules and data lifecycle rules',
      description: 'Applies legal retention policies to records and prepares cleanup recommendations.',
      api_key: 'ak_hb6j3d1q9v5t',
      certificate: 'CERT-HB-2026-101',
      trust_score: 87,
      permissions: ['read:data', 'write:retention', 'approve:deletion'],
      audit_logs: [
        { timestamp: '2026-07-06T09:15:11Z', action: 'Applied retention schedule', status: 'Approved' },
        { timestamp: '2026-07-06T07:22:32Z', action: 'Requested archive review', status: 'Pending' },
      ],
    },
    {
      agent_id: 'agent-8008',
      agent_name: 'Pine CRM Coordinator',
      owner_name: 'Ethan Flores',
      purpose: 'Updates account notes and unmutes high-value customer journeys',
      description: 'Tracks CRM notes, surfaces next actions, and highlights customers with recent escalations.',
      api_key: 'ak_pi5n1k7w3r8q',
      certificate: 'CERT-PI-2026-114',
      trust_score: 75,
      permissions: ['read:crm', 'write:note', 'review:journey'],
      audit_logs: [
        { timestamp: '2026-07-05T18:00:02Z', action: 'Updated account notes', status: 'Completed' },
        { timestamp: '2026-07-05T15:11:37Z', action: 'Flagged churn risk', status: 'Needs Review' },
      ],
    },
    {
      agent_id: 'agent-9009',
      agent_name: 'Mesa Incident Responder',
      owner_name: 'Riley Park',
      purpose: 'Coordinates incident triage and responder messaging',
      description: 'Collects incident context and drafts comms for responders, leadership, and clients.',
      api_key: 'ak_ms4c2v8q6p1x',
      certificate: 'CERT-MS-2026-127',
      trust_score: 92,
      permissions: ['read:incident', 'write:brief', 'approve:response'],
      audit_logs: [
        { timestamp: '2026-07-04T20:44:57Z', action: 'Opened incident bridge', status: 'Approved' },
        { timestamp: '2026-07-04T19:11:08Z', action: 'Shared stakeholder update', status: 'Completed' },
      ],
    },
    {
      agent_id: 'agent-1010',
      agent_name: 'Solstice Access Guard',
      owner_name: 'Chloe Nguyen',
      purpose: 'Approves privileged access requests based on role and location',
      description: 'Evaluates access requests against approved role matrices and geofencing signals.',
      api_key: 'ak_sl8b3t5m1p9k',
      certificate: 'CERT-SL-2026-143',
      trust_score: 90,
      permissions: ['read:access', 'write:approval', 'review:location'],
      audit_logs: [
        { timestamp: '2026-07-03T11:39:16Z', action: 'Approved temporary access', status: 'Approved' },
        { timestamp: '2026-07-03T10:04:41Z', action: 'Blocked out-of-policy request', status: 'Blocked' },
      ],
    },
  ];
}

function seedMemoryAgents() {
  if (memoryAgents.length > 0) {
    return;
  }

  memoryAgents.push(...buildDemoAgentSeed());
}

function normalizeAgentRecord(record = {}) {
  return {
    ...record,
    certificate: record.certificate || 'CERT-DEMO-000',
    permissions: Array.isArray(record.permissions) ? record.permissions : [],
    audit_logs: Array.isArray(record.audit_logs) ? record.audit_logs : [],
  };
}

function createPassportData(agent = {}) {
  const issueDate = new Date();
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 2);
  const passportNumber = `PXP-${String(agent.agent_id || 'AGT').replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase()}-${String(Math.floor(1000 + Math.random() * 9000))}`;

  return {
    passport_number: passportNumber,
    qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(agent.agent_id || passportNumber)}`,
    agent_id: agent.agent_id || 'agent-0000',
    owner: agent.owner_name || agent.owner || 'Unknown Owner',
    trust_score: agent.trust_score || 0,
    permissions: Array.isArray(agent.permissions) ? agent.permissions : [],
    digital_signature: `${(agent.owner_name || agent.owner || 'System').split(' ').map((value) => value[0] || '').join('').toUpperCase()}-SIG`,
    verification_badge: (agent.trust_score || 0) >= 90 ? 'Verified Elite' : (agent.trust_score || 0) >= 80 ? 'Verified Standard' : 'Review Required',
    issued_on: issueDate.toISOString().slice(0, 10),
    expires_on: expiryDate.toISOString().slice(0, 10),
  };
}

app.use(express.json());

let pool = null;
let usePostgres = false;

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  });
}

function generateAgentId(name) {
  const slug = String(name || 'agent')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'agent';
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${slug}-${suffix}`;
}

function generateApiKey() {
  return `ak_${Math.random().toString(36).slice(2, 12)}_${Math.random().toString(36).slice(2, 12)}`;
}

function generateTrustScore() {
  return Math.floor(70 + Math.random() * 30);
}

async function initializeDatabase() {
  seedMemoryAgents();

  try {
    pool = createPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        agent_id TEXT UNIQUE NOT NULL,
        agent_name TEXT NOT NULL,
        purpose TEXT NOT NULL,
        description TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        api_key TEXT NOT NULL,
        trust_score INTEGER NOT NULL,
        certificate TEXT,
        permissions JSONB DEFAULT '[]'::jsonb,
        audit_logs JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query("ALTER TABLE agents ADD COLUMN IF NOT EXISTS certificate TEXT");
    await pool.query("ALTER TABLE agents ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb");
    await pool.query("ALTER TABLE agents ADD COLUMN IF NOT EXISTS audit_logs JSONB DEFAULT '[]'::jsonb");

    const countResult = await pool.query('SELECT COUNT(*)::int AS count FROM agents');
    if (countResult.rows[0].count === 0) {
      for (const agent of buildDemoAgentSeed()) {
        await pool.query(
          `INSERT INTO agents (agent_id, agent_name, purpose, description, owner_name, api_key, trust_score, certificate, permissions, audit_logs)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [agent.agent_id, agent.agent_name, agent.purpose, agent.description, agent.owner_name, agent.api_key, agent.trust_score, agent.certificate, JSON.stringify(agent.permissions || []), JSON.stringify(agent.audit_logs || [])]
        );
      }
    }

    usePostgres = true;
    console.log('Using PostgreSQL for agent storage');
  } catch (error) {
    usePostgres = false;
    console.warn('PostgreSQL unavailable, falling back to in-memory storage:', error.message);
  }
}

async function fetchAgents() {
  if (usePostgres && pool) {
    const result = await pool.query('SELECT * FROM agents ORDER BY created_at DESC');
    return result.rows.map((row) => normalizeAgentRecord({
      ...row,
      permissions: row.permissions,
      audit_logs: row.audit_logs,
    }));
  }

  seedMemoryAgents();
  return memoryAgents.slice().reverse();
}

async function saveAgent(record) {
  const normalized = {
    ...record,
    certificate: record.certificate || `CERT-${String(record.agent_name || 'DEMO').slice(0, 3).toUpperCase()}-${String(record.trust_score || 0).padStart(3, '0')}`,
    permissions: Array.isArray(record.permissions) ? record.permissions : ['read:agent'],
    audit_logs: Array.isArray(record.audit_logs) ? record.audit_logs : [{ timestamp: new Date().toISOString(), action: 'Registered agent', status: 'Created' }],
  };

  if (usePostgres && pool) {
    const result = await pool.query(
      `INSERT INTO agents (agent_id, agent_name, purpose, description, owner_name, api_key, trust_score, certificate, permissions, audit_logs)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [normalized.agent_id, normalized.agent_name, normalized.purpose, normalized.description, normalized.owner_name, normalized.api_key, normalized.trust_score, normalized.certificate, JSON.stringify(normalized.permissions), JSON.stringify(normalized.audit_logs)]
    );
    return normalizeAgentRecord(result.rows[0]);
  }

  const stored = {
    ...normalized,
    id: memoryAgents.length + 1,
    created_at: new Date().toISOString(),
  };
  memoryAgents.push(stored);
  return stored;
}

app.get('/api/agents', async (req, res) => {
  try {
    const agents = await fetchAgents();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch agents', details: error.message });
  }
});

app.post('/api/agents', async (req, res) => {
  const { agentName, purpose, description, ownerName } = req.body || {};

  if (!agentName || !purpose || !description || !ownerName) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const agentId = generateAgentId(agentName);
  const apiKey = generateApiKey();
  const trustScore = generateTrustScore();

  try {
    const saved = await saveAgent({
      agent_id: agentId,
      agent_name: agentName,
      purpose,
      description,
      owner_name: ownerName,
      api_key: apiKey,
      trust_score: trustScore,
    });

    const passport = createPassportData(saved);
    res.status(201).json({ ...saved, passport });
  } catch (error) {
    res.status(500).json({ error: 'Unable to save agent', details: error.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', storage: usePostgres ? 'postgres' : 'memory' }));

app.post('/api/analyze-trust', async (req, res) => {
  try {
    const result = await analyzeTrust(req.body || {});
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to analyze agent trust', details: error.message });
  }
});

app.get('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to initialize server', error);
      process.exit(1);
    });
}

module.exports = {
  app,
  buildDemoAgentSeed,
  createPassportData,
  generateAgentId,
  generateApiKey,
  generateTrustScore,
  initializeDatabase,
};
