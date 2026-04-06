"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs/db'
import { User } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'

const Plans = [
    {
        id: 1,
        name: 'Starter',
        credits: 10,
        price: 99,
        description: 'Perfect for trying out the platform',
        features: ['10 Course Credits', 'AI Generated Content', 'YouTube Integration', 'Chapter Quizzes']
    },
    {
        id: 2,
        name: 'Pro',
        credits: 25,
        price: 199,
        description: 'Most popular choice',
        features: ['25 Course Credits', 'AI Generated Content', 'YouTube Integration', 'Chapter Quizzes', 'Priority Support'],
        popular: true
    },
    {
        id: 3,
        name: 'Power',
        credits: 60,
        price: 399,
        description: 'Best value for power users',
        features: ['60 Course Credits', 'AI Generated Content', 'YouTube Integration', 'Chapter Quizzes', 'Priority Support', 'Best Value']
    }
]

function Upgrade() {
    const { user } = useUser();
    const [userCredits, setUserCredits] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) GetUserCredits();
    }, [user])

    // Load Razorpay script on mount
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, [])

    const GetUserCredits = async () => {
        const result = await db.select().from(User).where(eq(User.email, user?.primaryEmailAddress?.emailAddress));
        setUserCredits(result[0]?.credits);
    }

    const onPayment = async (plan) => {
        setLoading(true);
        try {
            // Create order
            const res = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: plan.price })
            });
            const { orderId } = await res.json();

            // Open Razorpay modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: plan.price * 100,
                currency: 'INR',
                name: 'AI Course Generator',
                description: `${plan.credits} Course Credits`,
                order_id: orderId,
                handler: async (response) => {
                    // Verify payment and add credits
                    const verifyRes = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userEmail: user?.primaryEmailAddress?.emailAddress,
                            credits: plan.credits
                        })
                    });
                    const data = await verifyRes.json();
                    if (data.success) {
                        setUserCredits(data.newCredits);
                        alert(`Payment successful! ${plan.credits} credits added to your account.`);
                    }
                },
                prefill: {
                    name: user?.fullName,
                    email: user?.primaryEmailAddress?.emailAddress,
                },
                theme: { color: '#7C3AED' }
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    return (
        <div>
            {/* Current Credits */}
            <div className='text-center mb-10'>
                <h2 className='font-bold text-3xl'>Buy Credits</h2>
                <p className='text-gray-500 mt-2'>Each credit lets you generate one complete AI course</p>
                <div className='mt-4 inline-block bg-purple-50 border border-primary px-6 py-3 rounded-full'>
                    <span className='text-primary font-bold text-lg'>Current Credits: {userCredits}</span>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
                {Plans.map((plan) => (
                    <div key={plan.id} className={`border rounded-2xl p-6 flex flex-col gap-4 shadow-sm relative
                        ${plan.popular ? 'border-primary shadow-md scale-105' : ''}`}>
                        
                        {plan.popular && 
                            <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-4 py-1 rounded-full'>
                                Most Popular
                            </div>
                        }

                        <h3 className='font-bold text-xl'>{plan.name}</h3>
                        <p className='text-gray-500 text-sm'>{plan.description}</p>

                        <div className='flex items-end gap-1'>
                            <span className='font-bold text-4xl'>₹{plan.price}</span>
                            <span className='text-gray-400 mb-1'>one-time</span>
                        </div>

                        <div className='bg-purple-50 rounded-lg p-3 text-center'>
                            <span className='text-primary font-bold text-lg'>{plan.credits} Credits</span>
                        </div>

                        <ul className='flex flex-col gap-2'>
                            {plan.features.map((feature, index) => (
                                <li key={index} className='flex items-center gap-2 text-sm text-gray-600'>
                                    <span className='text-green-500'>✓</span> {feature}
                                </li>
                            ))}
                        </ul>

                        <Button 
                            onClick={() => onPayment(plan)}
                            disabled={loading}
                            className={`mt-auto w-full ${plan.popular ? '' : 'variant-outline'}`}>
                            Buy {plan.credits} Credits
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Upgrade