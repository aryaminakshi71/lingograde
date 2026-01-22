'use client'

import {
  ComposedChart as RechartsComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer } from './ChartContainer'

interface ChartElement {
  type: 'line' | 'bar' | 'area'
  key: string
  name: string
  color?: string
  yAxisId?: string | number
}

interface ComposedChartProps {
  data: Array<Record<string, any>>
  dataKey: string
  elements: ChartElement[]
  title?: string
  description?: string
  height?: number
  loading?: boolean
  error?: string | null
  className?: string
}

export function ComposedChart({
  data,
  dataKey,
  elements,
  title,
  description,
  height = 300,
  loading = false,
  error = null,
  className,
}: ComposedChartProps) {
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
        <RechartsComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          {elements.map((element) => {
            const commonProps = {
              key: element.key,
              dataKey: element.key,
              name: element.name,
              stroke: element.color || '#3b82f6',
              fill: element.color || '#3b82f6',
              yAxisId: element.yAxisId,
            }

            switch (element.type) {
              case 'line':
                return <Line {...commonProps} strokeWidth={2} dot={{ r: 4 }} />
              case 'bar':
                return <Bar {...commonProps} radius={[4, 4, 0, 0]} />
              case 'area':
                return <Area {...commonProps} fillOpacity={0.6} />
              default:
                return null
            }
          })}
        </RechartsComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

