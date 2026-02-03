/**
 * Billing Page
 *
 * Subscription management and billing information.
 */

import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/dashboard/billing')({
  component: BillingPage,
});

function BillingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    try {
      const { createCheckoutSession } = await import('@/lib/stripe');
      const session = await createCheckoutSession({
        priceId,
        successUrl: `${window.location.origin}/dashboard/billing?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
      });
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  // Mock plan data - replace with actual API call
  const currentPlan = 'free'; // Fetch from API
  const membersCount = 1; // Fetch from API
  const maxMembers = currentPlan === 'free' ? 5 : currentPlan === 'pro' ? 20 : 100;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-1">
          Manage your subscription and billing information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Current Plan</h2>
          <p className="text-gray-600 text-sm mb-4">
            You are currently on the <span className="capitalize font-medium text-gray-900">{currentPlan}</span> plan.
          </p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-gray-900">
              {currentPlan === 'free' ? '$0' : currentPlan === 'pro' ? '$19' : '$49'}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          <button
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            disabled={loading || currentPlan === 'enterprise'}
            onClick={() => {
              if (currentPlan === 'free') {
                handleCheckout('price_pro_plan'); // Replace with actual price ID
              } else {
                // Open customer portal
                alert('Customer portal integration coming soon');
              }
            }}
          >
            {currentPlan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Usage</h2>
          <p className="text-gray-600 text-sm mb-4">
            Your current usage this billing period.
          </p>
          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Users</span>
                <span className="text-gray-900">{membersCount} / {maxMembers}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-green-600"
                  style={{ width: `${Math.min((membersCount / maxMembers) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Students</span>
                <span className="text-gray-900">Unlimited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
