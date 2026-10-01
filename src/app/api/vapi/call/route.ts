import { NextResponse } from 'next/server';
import { INITIAL_CUSTOMERS } from '@/data/mockCustomers';
import { buildVapiAssistantConfig } from '@/data/vapiAssistantConfig';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, phoneNumber, vapiApiKey, vapiPhoneNumberId, vapiAssistantId } = body;

    const apiKey = vapiApiKey || process.env.VAPI_API_KEY;
    const phoneId = vapiPhoneNumberId || process.env.VAPI_PHONE_NUMBER_ID;
    const assistantId = vapiAssistantId || process.env.VAPI_ASSISTANT_ID;

    // Look up customer
    const customer = INITIAL_CUSTOMERS.find((c) => c.id === customerId);
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    // Check if real Vapi credentials are provided
    if (apiKey && (phoneId || assistantId)) {
      try {
        const payload: any = {
          phoneNumberId: phoneId,
          customer: {
            number: phoneNumber,
            name: customer.name,
          },
        };

        if (assistantId) {
          payload.assistantId = assistantId;
          payload.assistantOverrides = {
            variableValues: {
              customer_name: customer.name,
              merchant_name: customer.merchantName,
              plan_name: customer.planName,
              amount: customer.amount,
              failure_reason: customer.failureReason,
            },
          };
        } else {
          // Use transient inline assistant config
          payload.assistant = buildVapiAssistantConfig(customer);
        }

        const vapiRes = await fetch('https://api.vapi.ai/call/phone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        const vapiData = await vapiRes.json();

        if (!vapiRes.ok) {
          return NextResponse.json({
            success: false,
            error: vapiData.message || 'Vapi API error occurred while placing call',
            details: vapiData,
          }, { status: vapiRes.status });
        }

        return NextResponse.json({
          success: true,
          mode: 'LIVE_TELEPHONY',
          callId: vapiData.id,
          status: vapiData.status || 'queued',
          message: `Outbound call initiated to ${phoneNumber} via Vapi.ai!`,
          customer,
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: `Failed to connect to Vapi API: ${err.message}`,
        }, { status: 500 });
      }
    }

    // If no Vapi credentials yet, return helpful instructions for real telephony & invite browser demo
    return NextResponse.json({
      success: true,
      mode: 'SIMULATION_READY',
      callId: `vapi_sim_${Date.now()}`,
      status: 'simulated',
      message: `Vapi API keys not detected in .env.local. The call simulation is ready, or add VAPI_API_KEY & VAPI_PHONE_NUMBER_ID to trigger a real telephone call to ${phoneNumber}!`,
      customer,
      requiresKey: true,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
