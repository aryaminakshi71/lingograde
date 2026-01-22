'use client'

import { useState } from 'react'
import { Zap, Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from 'lucide-react'
import { cn } from '../../utils'

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  enabled: boolean
  lastRun?: Date
  runCount: number
}

interface AutomationRulesProps {
  rules?: AutomationRule[]
  onCreate?: () => void
  onEdit?: (rule: AutomationRule) => void
  onDelete?: (id: string) => void
  onToggle?: (id: string, enabled: boolean) => void
  className?: string
}

export function AutomationRules({
  rules = [],
  onCreate,
  onEdit,
  onDelete,
  onToggle,
  className,
}: AutomationRulesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Automation Rules</h3>
          <p className="text-sm text-gray-500 mt-1">
            Automate repetitive tasks and workflows
          </p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Rule
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No automation rules yet</p>
          <button
            onClick={onCreate}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first rule
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                    <button
                      onClick={() => onToggle?.(rule.id, !rule.enabled)}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      {rule.enabled ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                      <span>{rule.enabled ? 'Enabled' : 'Disabled'}</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>When: {rule.trigger}</span>
                    <span>Then: {rule.action}</span>
                    {rule.lastRun && (
                      <span>Last run: {new Date(rule.lastRun).toLocaleDateString()}</span>
                    )}
                    <span>Runs: {rule.runCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onEdit?.(rule)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Edit rule"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(rule.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

