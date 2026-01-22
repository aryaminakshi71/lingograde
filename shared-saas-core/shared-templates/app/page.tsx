import { Metadata } from 'next'
import Link from 'next/link'
import { Check, Zap, Shield, Globe, Smartphone, DollarSign, FileText, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CashConnect - Financial Services Platform | Free Trial',
  description: 'Complete financial management for small businesses. Only $29/month. 14-day free trial.',
  keywords: 'financial software, invoicing, payments, small business finance',
}

const features = [
  { icon: DollarSign, title: 'Payment Processing', description: 'Accept credit cards, ACH, and digital wallets.', badge: 'Payments' },
  { icon: FileText, title: 'Smart Invoicing', description: 'Create and send invoices in seconds.', badge: 'AI' },
  { icon: Users, title: 'Client Management', description: 'Track clients and payment history.', badge: 'CRM' },
  { icon: Shield, title: 'Bank-Level Security', description: 'PCI DSS compliant with encrypted transactions.', badge: 'Secure' },
  { icon: Globe, title: 'Multi-Currency', description: 'Accept payments in 135+ currencies.', badge: 'Global' },
  { icon: Smartphone, title: 'Mobile App', description: 'Manage finances from anywhere.', badge: 'Mobile' },
]

const pricingPlans = [
  { name: 'Starter', price: 29, features: ['100 transactions/mo', 'Basic invoicing', 'Email support', '1 user'], popular: false },
  { name: 'Professional', price: 79, features: ['1,000 transactions/mo', 'Advanced features', 'Priority support', '5 users', 'API access'], popular: true },
  { name: 'Enterprise', price: 199, features: ['Unlimited transactions', 'Custom solutions', 'Dedicated support', 'Unlimited users', 'Custom integrations'], popular: false },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CashConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 font-medium">Sign In</Link>
              <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Financial Power for <span className="text-blue-600">Growing Businesses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            All-in-one financial platform: payments, invoicing, and client management.
            From $29/month with a 14-day free trial.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 flex items-center justify-center">
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-500">No credit card · Cancel anytime · PCI DSS Certified</p>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Financial Suite</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-3 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Start at $29/month. Save 20% annually.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : 'border border-gray-100'}`}>
                {plan.popular && <div className="bg-blue-500 text-white text-center py-1 rounded-lg text-sm font-medium -mt-14 mb-4">Most Popular</div>}
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="my-6"><span className="text-5xl font-bold text-gray-900">${plan.price}</span><span className="text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center text-gray-600"><Check className="w-5 h-5 text-blue-500 mr-3" />{feat}</li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-3 rounded-xl font-semibold ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900'}`}>
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">© 2026 CashConnect. All rights reserved. PCI DSS Certified.</p>
        </div>
      </footer>
    </div>
  )
}
