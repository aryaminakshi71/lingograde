'use client'

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer } from './ChartContainer'

interface AreaChartProps {
  data: Array<Record<string, any>>
  dataKey: string
  areas: Array<{
    key: string
    name: string
    color?: string
    fillOpacity?: number
  }>
  title?: string
  description?: string
  height?: number
  loading?: boolean
  error?: string | null
  className?: string
}

export function AreaChart({
  data,
  dataKey,
  areas,
  title,
  description,
  height = 300,
  loading = false,
  error = null,
  className,
}: AreaChartProps) {
  return (
    <ChartContainer
      title={title}
      description={description}
      height={height}
      loading={loading}
      error={error}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {areas.map((area, index) => (
              <linearGradient key={area.key} id={`color${area.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.color || '#3b82f6'} stopOpacity={0.8} />
                <stop offset="95%" stopColor={area.color || '#3b82f6'} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={dataKey}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          {areas.map((area) => (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name}
              stroke={area.color || '#3b82f6'}
              fill={`url(#color${area.key})`}
              fillOpacity={area.fillOpacity || 0.6}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

