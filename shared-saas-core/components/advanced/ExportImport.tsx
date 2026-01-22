'use client'

import { useState } from 'react'
import { Download, Upload, FileText, FileSpreadsheet, Database, CheckCircle } from 'lucide-react'
import { cn, downloadAsJson, downloadAsCsv } from '../../utils'

interface ExportImportProps {
  data?: any[]
  onImport?: (data: any[]) => Promise<void>
  exportFormats?: ('json' | 'csv' | 'xlsx')[]
  importFormats?: ('json' | 'csv' | 'xlsx')[]
  className?: string
}

export function ExportImport({
  data = [],
  onImport,
  exportFormats = ['json', 'csv'],
  importFormats = ['json', 'csv'],
  className,
}: ExportImportProps) {
  const [importing, setImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)

  const handleExport = (format: 'json' | 'csv' | 'xlsx') => {
    if (data.length === 0) {
      alert('No data to export')
      return
    }

    const filename = `export-${new Date().toISOString().split('T')[0]}`

    switch (format) {
      case 'json':
        downloadAsJson(data, filename)
        break
      case 'csv':
        downloadAsCsv(data, filename)
        break
      case 'xlsx':
        // XLSX export would require xlsx library
        alert('XLSX export requires additional library. Using CSV instead.')
        downloadAsCsv(data, filename)
        break
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onImport) return

    setImporting(true)
    setImportSuccess(false)

    try {
      const text = await file.text()
      let parsedData: any[]

      if (file.name.endsWith('.json')) {
        parsedData = JSON.parse(text)
      } else if (file.name.endsWith('.csv')) {
        // Simple CSV parser
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        parsedData = lines.slice(1).map((line) => {
          const values = line.split(',')
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || ''
            return obj
          }, {} as any)
        })
      } else {
        throw new Error('Unsupported file format')
      }

      await onImport(parsedData)
      setImportSuccess(true)
      setTimeout(() => setImportSuccess(false), 3000)
    } catch (error) {
      console.error('Import error:', error)
      alert('Failed to import file. Please check the format.')
    } finally {
      setImporting(false)
      // Reset input
      event.target.value = ''
    }
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Export */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Export:</span>
        {exportFormats.includes('json') && (
          <button
            onClick={() => handleExport('json')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Export as JSON"
          >
            <FileText className="w-4 h-4" />
            JSON
          </button>
        )}
        {exportFormats.includes('csv') && (
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Export as CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>
        )}
      </div>

      {/* Import */}
      {onImport && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Import:</span>
          <label className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {importing ? 'Importing...' : 'Upload'}
            <input
              type="file"
              accept={importFormats.map((f) => `.${f}`).join(',')}
              onChange={handleImport}
              className="hidden"
              disabled={importing}
            />
          </label>
          {importSuccess && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              Imported
            </div>
          )}
        </div>
      )}
    </div>
  )
}

