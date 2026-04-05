import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    try {
        const { amount } = await req.json();

        const order = await razorpay.orders.create({
            amount: amount * 100, // Razorpay takes amount in paise
            currency: 'INR',
            receipt: 'receipt_' + Date.now(),
        });

        return NextResponse.json({ orderId: order.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}