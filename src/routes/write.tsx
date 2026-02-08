import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { FileText, Sparkles, ArrowRight, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react'

export const Route = createFileRoute('/write')({
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
  component: WritingPage,
})

function WritingPage() {
  const [text, setText] = useState('')
  const [taskType, setTaskType] = useState<'essay' | 'email' | 'story'>('essay')
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'analyze' | 'improve' | 'translate'>('analyze')

  const analyzeText = useMutation({
    mutationFn: () => orpc.writingAssistant.analyzeText.mutate({
      text,
      language: 'es',
      taskType,
    }),
    onSuccess: (data) => setResult(data.feedback),
  })

  const improveStyle = useMutation({
    mutationFn: () => orpc.writingAssistant.improveStyle.mutate({
      text,
      language: 'es',
      style: 'more_professional',
    }),
    onSuccess: (data) => setResult(data),
  })

  const expandVocab = useMutation({
    mutationFn: () => orpc.writingAssistant.expandVocabulary.mutate({
      text,
      language: 'es',
    }),
    onSuccess: (data) => setResult(data),
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FileText className="w-8 h-8 text-emerald-500" />
          AI Writing Assistant
        </h1>

        <div className="flex gap-4 mb-6">
          {['analyze', 'improve', 'translate'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-semibold mb-4">Your Text</h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your text here..."
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none"
            />
            <div className="mt-4 flex items-center justify-between">
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as any)}
                className="bg-gray-100 px-4 py-2 rounded-lg"
              >
                <option value="essay">Essay</option>
                <option value="email">Email</option>
                <option value="story">Story</option>
              </select>
              <button
                onClick={() => {
                  if (activeTab === 'analyze') analyzeText.mutate()
                  else if (activeTab === 'improve') improveStyle.mutate()
                  else expandVocab.mutate()
                }}
                disabled={!text.trim() || analyzeText.isPending}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {analyzeText.isPending ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-semibold mb-4">AI Feedback</h3>
            {!result ? (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Your feedback will appear here...
              </div>
            ) : (
              <div className="space-y-6">
                {result.overallGrade && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-semibold">Overall Grade</span>
                    <span className="text-3xl font-bold text-emerald-600">{result.overallGrade}</span>
                  </div>
                )}

                {result.improvements && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Improvements
                    </h4>
                    <ul className="space-y-2">
                      {result.improvements.slice(0, 5).map((item: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.vocabularySuggestions && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-500" />
                      Vocabulary Suggestions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.vocabularySuggestions.slice(0, 6).map((word: string, i: number) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.strengths && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {result.strengths.slice(0, 3).map((item: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
