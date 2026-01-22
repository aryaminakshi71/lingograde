'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer } from './ChartContainer'

interface BarChartProps {
  data: Array<Record<string, any>>
  dataKey: string
  bars: Array<{
    key: string
    name: string
    color?: string
  }>
  title?: string
  description?: string
  height?: number
  loading?: boolean
  error?: string | null
  className?: string
  layout?: 'horizontal' | 'vertical'
}

export function BarChart({
  data,
  dataKey,
  bars,
  title,
  description,
  height = 300,
  loading = false,
  error = null,
  className,
  layout = 'vertical',
}: BarChartProps) {
  const ChartComponent = layout === 'horizontal' ? RechartsBarChart : RechartsBarChart

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
        <ChartComponent
          data={data}
          layout={layout}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          {layout === 'vertical' ? (
            <>
              <XAxis
                dataKey={dataKey}
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            </>
          ) : (
            <>
              <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey={dataKey}
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color || '#3b82f6'}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

