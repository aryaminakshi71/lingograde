'use client'

import { useState, useEffect } from 'react'
import { BarChart3, FileText, Download, Loader2, CheckCircle2 } from 'lucide-react'

interface Report {
  id: string
  name: string
  type: string
  date: string
  status: 'Generated' | 'Processing' | 'Failed'
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    { id: 'RPT001', name: 'Monthly Performance Summary', type: 'Summary', date: '2025-03-01', status: 'Generated' },
    { id: 'RPT002', name: 'Q4 Sales Analysis', type: 'Sales', date: '2025-02-15', status: 'Generated' },
    { id: 'RPT003', name: 'User Engagement Metrics', type: 'Analytics', date: '2025-02-01', status: 'Processing' },
    { id: 'RPT004', name: 'Weekly Activity Log', type: 'Activity', date: '2025-02-28', status: 'Generated' },
  ])
  const [loading, setLoading] = useState(false)

  const handleGenerateReport = async (type: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newReport: Report = {
        id: `RPT${(reports.length + 1).toString().padStart(3, '0')}`,
        name: `${type} Report - ${new Date().toLocaleDateString()}`,
        type: type,
        date: new Date().toISOString().split('T')[0],
        status: 'Generated',
      }
      setReports((prev) => [newReport, ...prev])
      
      // Show success message
      alert(`Report generated successfully! Report ID: ${newReport.id}`)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId)
    if (report && report.status === 'Generated') {
      // Simulate download
      alert(`Downloading report: ${report.name}`)
      // In production, this would trigger actual file download
      console.log(`Downloading report ${reportId}`)
    } else {
      alert('Report is not ready for download yet.')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage your business reports</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleGenerateReport('Summary')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate Summary
          </button>
          <button
            onClick={() => handleGenerateReport('Analytics')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
            Generate Analytics
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 text-gray-900 font-medium">{report.name}</td>
                <td className="px-6 py-4 text-gray-600">{report.type}</td>
                <td className="px-6 py-4 text-gray-600">{report.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Generated' ? 'bg-green-100 text-green-800' :
                    report.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {report.status === 'Generated' ? (
                    <button 
                      onClick={() => handleDownloadReport(report.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center mx-auto gap-1"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                  ) : report.status === 'Processing' ? (
                    <span className="text-yellow-600 text-sm flex items-center justify-center mx-auto gap-1">
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing
                    </span>
                  ) : (
                    <span className="text-red-600 text-sm flex items-center justify-center mx-auto gap-1">
                      Failed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

