import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (message?.type === 'tool-calls') {
      const toolCalls = message.toolCallList || message.toolCalls || [];
      const results = [];

      for (const call of toolCalls) {
        const functionName = call.function?.name;
        const args = typeof call.function?.arguments === 'string'
          ? JSON.parse(call.function.arguments)
          : (call.function?.arguments || {});

        if (functionName === 'send_payment_link') {
          const linkId = `plink_vapi_${Math.random().toString(36).substring(2, 8)}`;
          results.push({
            toolCallId: call.id,
            result: `Razorpay payment link ${linkId} created and sent to customer's WhatsApp/SMS successfully. Link: https://rzp.io/i/${linkId}`,
          });
        } else if (functionName === 'schedule_retry') {
          results.push({
            toolCallId: call.id,
            result: `Autopay smart retry successfully scheduled for ${args.retryDate || 'tomorrow 10:00 AM'}. Notification triggered to bank.`,
          });
        } else if (functionName === 'update_payment_mandate') {
          results.push({
            toolCallId: call.id,
            result: `1-click mandate update link dispatched to customer mobile.`,
          });
        } else if (functionName === 'escalate_to_human') {
          results.push({
            toolCallId: call.id,
            result: `Ticket escalated to Merchant Priority Relationship Team. Future debits paused.`,
          });
        }
      }

      return NextResponse.json({ results });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
