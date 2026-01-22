'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: 49,
    description: 'For small financial services businesses',
    features: [
      { name: 'Up to 100 transactions/month', included: true },
      { name: 'Payment processing', included: true },
      { name: 'Basic invoicing', included: true },
      { name: 'Client database', included: true },
      { name: 'Transaction history', included: true },
      { name: 'Email support', included: true },
      { name: 'API access', included: false },
      { name: 'Multi-currency', included: false },
      { name: 'Advanced reports', included: false },
      { name: 'Custom branding', included: false },
    ],
  },
  {
    name: 'Professional',
    price: 129,
    description: 'For growing financial services',
    popular: true,
    features: [
      { name: 'Up to 2,000 transactions/month', included: true },
      { name: 'Full payment suite', included: true },
      { name: 'Advanced invoicing', included: true },
      { name: 'CRM integration', included: true },
      { name: 'Detailed analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Full API access', included: true },
      { name: 'Multi-currency support', included: true },
      { name: 'Custom reports', included: true },
      { name: 'White-label option', included: true },
    ],
  },
  {
    name: 'Enterprise',
    price: 349,
    description: 'For financial institutions',
    features: [
      { name: 'Unlimited transactions', included: true },
      { name: 'Enterprise payments', included: true },
      { name: 'Complete billing suite', included: true },
      { name: 'Advanced CRM', included: true },
      { name: 'Predictive analytics', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Custom API development', included: true },
      { name: 'Global payments', included: true },
      { name: 'Compliance tools', included: true },
      { name: 'On-premise option', included: true },
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const yearlyDiscount = 0.2;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Financial Services Platform
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Secure payment processing and financial management.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-2 text-green-600 text-xs font-semibold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-500">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${billingCycle === 'yearly' 
                      ? Math.round(plan.price * 12 * (1 - yearlyDiscount)) / 12
                      : plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="mt-2 text-sm text-green-600">
                    Billed annually (${Math.round(plan.price * 12 * (1 - yearlyDiscount))}/year)
                  </p>
                )}

                <Link
                  href="/register"
                  className={`mt-8 block w-full py-3 px-6 text-center font-semibold rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
              <div className="px-8 pb-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mr-3" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Need custom financial solutions?</h2>
          <p className="mt-4 text-gray-600">
            Contact us for banking integrations, compliance solutions, and enterprise deployments.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Contact Sales
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                What payment methods are supported?
              </h3>
              <p className="mt-2 text-gray-600">
                Credit cards, ACH, wire transfers, and digital wallets with instant settlement.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Is PCI compliance included?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, we handle PCI compliance for all transactions automatically.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Can I integrate with accounting software?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, Professional and Enterprise plans integrate with QuickBooks, Xero, and more.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                What currencies are supported?
              </h3>
              <p className="mt-2 text-gray-600">
                135+ currencies with real-time exchange rates and multi-currency accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
