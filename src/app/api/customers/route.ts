import { NextResponse } from 'next/server';
import { INITIAL_CUSTOMERS } from '@/data/customers';
import { CustomerRecord } from '@/types';

let customersStore: CustomerRecord[] = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));

export async function GET() {
  return NextResponse.json({
    success: true,
    data: customersStore,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    const index = customersStore.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    customersStore[index] = {
      ...customersStore[index],
      ...updates,
    };

    return NextResponse.json({
      success: true,
      data: customersStore[index],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'RESET') {
      customersStore = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
      return NextResponse.json({ success: true, data: customersStore });
    }
    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
