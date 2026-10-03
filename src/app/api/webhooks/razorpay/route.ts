import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity || payload.data;

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
