import { createFileRoute } from '@tanstack/react-router'
import { useDarkMode } from '@shared/saas-core'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { darkMode, toggleDarkMode } = useDarkMode()
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application settings</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue="user@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Appearance</h3>
            <p className="text-gray-600 text-sm mb-4">Customize the appearance of the application.</p>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-700">Dark Mode</span>
              <label htmlFor="darkMode" className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="darkMode" 
                  className="sr-only peer" 
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700">Push notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">SMS notifications</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              Change Password
            </button>
            <button className="w-full border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
