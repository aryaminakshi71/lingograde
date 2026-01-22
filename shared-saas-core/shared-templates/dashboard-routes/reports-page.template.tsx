'use client'

export default function ReportsPage() {
  const reports = [
    { id: 'RPT001', title: 'Monthly Summary Report', type: 'Summary', generated: '2025-01-20', status: 'Ready' },
    { id: 'RPT002', title: 'User Activity Report', type: 'Analytics', generated: '2025-01-19', status: 'Ready' },
    { id: 'RPT003', title: 'Performance Report', type: 'Performance', generated: '2025-01-18', status: 'Processing' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and download reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Generate Report</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Generate Summary Report
            </button>
            <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              Generate Detailed Report
            </button>
            <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              Export Data
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Report Statistics</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Reports</div>
              <div className="text-2xl font-bold text-gray-900">24</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">This Month</div>
              <div className="text-2xl font-bold text-green-600">8</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Generated Reports</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{report.title}</td>
                <td className="px-6 py-4 text-gray-600">{report.type}</td>
                <td className="px-6 py-4 text-gray-600">{report.generated}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

