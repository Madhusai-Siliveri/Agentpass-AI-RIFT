import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const agent = {
      agent_id: `agent-${Math.floor(1000 + Math.random() * 9000)}`,
      agent_name: body.agentName || 'Unnamed Agent',
      purpose: body.purpose || 'Not specified',
      description: body.description || 'Not specified',
      owner_name: body.ownerName || 'Unknown Owner',
      api_key: `ak_${Math.random().toString(36).slice(2, 12)}`,
      trust_score: 82,
      certificate: `CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      permissions: ['read:agent', 'write:summary'],
      audit_logs: [{ timestamp: new Date().toISOString(), action: 'Registered agent', status: 'Created' }],
    };

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to save agent' }, { status: 500 });
  }
}
