import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity || payload.data;

    console.log(`[Razorpay Webhook Received] Event: ${event}`, paymentEntity);

    // Respond 200 OK immediately as per Razorpay webhook contract
    return NextResponse.json({
      received: true,
      event,
      timestamp: new Date().toISOString(),
      status: 'processed',
    });
  } catch (error: any) {
    return NextResponse.json({ received: false, error: error.message }, { status: 400 });
  }
}
