import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Eye, Type, Volume2, Brain, Clock, Activity, Palette, Smartphone } from 'lucide-react'

export const Route = createFileRoute('/accessibility')({
  beforeLoad: async () => {
    try {
      const session = await orpc.auth.getSession.query()
      if (!session) {
        throw redirect({ to: '/login' })
      }
    } catch {
      throw redirect({ to: '/login' })
    }
  },
  component: AccessibilityPage,
})

function AccessibilityPage() {
  const { data: currentSettings } = useQuery({
    queryKey: ['accessibility'],
    queryFn: () => orpc.accessibility.getAccessibilitySettings.query({}),
  })

  const [settings, setSettings] = useState({
    dyslexiaFont: false,
    fontSize: 'medium',
    highContrast: false,
    ADHDMode: false,
    colorBlindMode: 'none',
    reduceMotion: false,
  })

  const updateSettings = useMutation({
    mutationFn: (newSettings: any) => orpc.accessibility.updateAccessibilitySettings.mutate(newSettings),
    onSuccess: () => {
      alert('Settings saved!')
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Eye className="w-8 h-8 text-emerald-500" />
          Accessibility Settings
        </h1>
        <p className="text-gray-600 mb-8">Customize your learning experience</p>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Type className="w-6 h-6 text-emerald-500" />
                <div>
                  <h3 className="font-semibold">Dyslexia-Friendly Font</h3>
                  <p className="text-sm text-gray-500">Use OpenDyslexic font for easier reading</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, dyslexiaFont: !settings.dyslexiaFont })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.dyslexiaFont ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.dyslexiaFont ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-emerald-500" />
                <div>
                  <h3 className="font-semibold">ADHD Mode</h3>
                  <p className="text-sm text-gray-500">Shorter lessons, more breaks, gamified elements</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, ADHDMode: !settings.ADHDMode })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.ADHDMode ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.ADHDMode ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-emerald-500" />
                <div>
                  <h3 className="font-semibold">High Contrast</h3>
                  <p className="text-sm text-gray-500">Enhanced colors for better visibility</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, highContrast: !settings.highContrast })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.highContrast ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.highContrast ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-emerald-500" />
              Font Size
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {['small', 'medium', 'large', 'extra_large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSettings({ ...settings, fontSize: size })}
                  className={`py-3 rounded-xl font-medium capitalize ${
                    settings.fontSize === size
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-4">Color Blindness Mode</h3>
            <select
              value={settings.colorBlindMode}
              onChange={(e) => setSettings({ ...settings, colorBlindMode: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            >
              <option value="none">None</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
            </select>
          </div>

          <button
            onClick={() => updateSettings.mutate(settings)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
