import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Smartphone, Bell, Download, Wifi, Battery, DownloadCloud } from 'lucide-react'

export const Route = createFileRoute('/mobile')({
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
  component: MobilePage,
})

function MobilePage() {
  const { data: settings } = useQuery({
    queryKey: ['mobileSettings'],
    queryFn: () => orpc.mobile.getPushSettings.query({}),
  })

  const { data: offline } = useQuery({
    queryKey: ['offlineContent'],
    queryFn: () => orpc.mobile.getOfflineContent.query({}),
  })

  const [notifSettings, setNotifSettings] = useState({
    dailyReminder: true,
    streakAlerts: true,
    lessonReminders: true,
    weeklyDigest: true,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Smartphone className="w-8 h-8 text-emerald-500" />
          Mobile Settings
        </h1>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <Smartphone className="w-16 h-16" />
            <div>
              <h3 className="text-xl font-bold">LingoGrade Mobile</h3>
              <p className="opacity-90">Learn anywhere, anytime</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-medium">
              Download for iOS
            </button>
            <button className="bg-white/20 px-6 py-2 rounded-lg font-medium">
              Download for Android
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6 text-emerald-500" />
          Notifications
        </h2>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-4">
          {[
            { key: 'dailyReminder', label: 'Daily Learning Reminder', desc: 'Get reminded to practice' },
            { key: 'streakAlerts', label: 'Streak Alerts', desc: 'Protect your streak' },
            { key: 'lessonReminders', label: 'Lesson Reminders', desc: 'Continue where you left off' },
            { key: 'weeklyDigest', label: 'Weekly Progress', desc: 'Weekly summary' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{item.label}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifSettings({ ...notifSettings, [item.key]: !notifSettings[item.key as keyof typeof notifSettings] })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  notifSettings[item.key as keyof typeof notifSettings] ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  notifSettings[item.key as keyof typeof notifSettings] ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DownloadCloud className="w-6 h-6 text-emerald-500" />
          Offline Content
        </h2>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500">Storage Used</span>
            <span className="font-medium">{offline?.estimatedStorage || '45 MB'}</span>
          </div>
          {offline?.downloadableLessons?.map((lesson: any) => (
            <div key={lesson.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  <p className="text-sm text-gray-500">{lesson.size}</p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg font-medium text-sm ${
                lesson.downloaded
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                {lesson.downloaded ? 'Downloaded' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
