'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        <aside className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white">CashConnect</h1>
            <p className="text-sm text-gray-400">Financial Services</p>
          </div>
          <nav className="space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 bg-gray-700 rounded text-white">Dashboard</Link>
            <Link href="/transactions" className="block px-4 py-2 text-gray-400 hover:bg-gray-700 rounded">Transactions</Link>
            <Link href="/invoices" className="block px-4 py-2 text-gray-400 hover:bg-gray-700 rounded">Invoices</Link>
            <Link href="/clients" className="block px-4 py-2 text-gray-400 hover:bg-gray-700 rounded">Clients</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Volume</p>
              <p className="text-2xl font-bold text-white">$45,280</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-white">156</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Pending Invoices</p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Active Clients</p>
              <p className="text-2xl font-bold text-white">24</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-medium">Payment to Vendor</p>
                  <p className="text-sm text-green-500">-$1,500</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-medium">Client Payment</p>
                  <p className="text-sm text-green-500">+$3,200</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700">New Transaction</button>
                <button className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700">Create Invoice</button>
                <button className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700">Add Client</button>
                <button className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700">View Reports</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
