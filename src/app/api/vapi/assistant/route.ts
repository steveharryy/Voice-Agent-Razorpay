import { NextResponse } from 'next/server';
import { INITIAL_CUSTOMERS } from '@/data/mockCustomers';
import { buildVapiAssistantConfig, VAPI_ASSISTANT_SYSTEM_PROMPT, VAPI_TOOL_DEFINITIONS } from '@/data/vapiAssistantConfig';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId') || 'cust_001';
  const customer = INITIAL_CUSTOMERS.find((c) => c.id === customerId) || INITIAL_CUSTOMERS[0];

  const config = buildVapiAssistantConfig(customer);

  return NextResponse.json({
    success: true,
    description: 'Vapi Assistant JSON payload for Razorpay Autopay Recovery Voice Agent',
    systemPrompt: VAPI_ASSISTANT_SYSTEM_PROMPT,
    tools: VAPI_TOOL_DEFINITIONS,
    fullConfig: config,
  });
}
