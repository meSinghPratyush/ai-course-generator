import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/configs/db';
import { User } from '@/configs/schema';
import { eq } from 'drizzle-orm';

export async function POST(req) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userEmail, credits } = await req.json();

        // Verify payment signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

        // Add credits to user
        const existing = await db.select().from(User).where(eq(User.email, userEmail));
        const currentCredits = existing[0]?.credits || 0;

        await db.update(User)
            .set({ credits: currentCredits + credits })
            .where(eq(User.email, userEmail));

        return NextResponse.json({ success: true, newCredits: currentCredits + credits });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}