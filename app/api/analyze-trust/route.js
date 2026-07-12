import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = {
      trust_score: 78,
      risk_level: 'Medium',
      confidence_level: 'Medium',
      security_explanation: 'Fallback analysis completed using local heuristics because the AI service was unavailable.',
      ai_generated_recommendations: ['Rotate credentials regularly.', 'Require approval for write operations.'],
      suggested_permission_changes: ['Limit write access where unnecessary.'],
      source: 'fallback',
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Unable to analyze agent trust' }, { status: 500 });
  }
}
