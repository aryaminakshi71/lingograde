'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        <aside className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <p className="text-sm text-gray-400">Account settings</p>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('general')} className={`block w-full text-left px-4 py-2 rounded ${activeTab === 'general' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>General</button>
            <button onClick={() => setActiveTab('payments')} className={`block w-full text-left px-4 py-2 rounded ${activeTab === 'payments' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>Payment Methods</button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">General Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Business Name</label>
                <input type="text" defaultValue="Finance Corp" className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white" />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Default Currency</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
