'use client'

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12.5%' },
    { label: 'Active Sessions', value: '856', change: '+8.2%' },
    { label: 'Revenue', value: '$45,678', change: '+15.3%' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.5%' },
  ]

  const chartData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 48 },
    { name: 'Thu', value: 61 },
    { name: 'Fri', value: 55 },
    { name: 'Sat', value: 38 },
    { name: 'Sun', value: 42 },
  ]

  const maxValue = Math.max(...chartData.map(d => d.value))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">View detailed analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-green-600">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Activity This Week</h2>
        <div className="flex items-end gap-4 h-64">
          {chartData.map((day) => (
            <div key={day.name} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(day.value / maxValue) * 200}px` }}
                />
                <span className="text-xs text-gray-600 mt-2">{day.value}</span>
              </div>
              <span className="text-xs text-gray-500 mt-2">{day.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

