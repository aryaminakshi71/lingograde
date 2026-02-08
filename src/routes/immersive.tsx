import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { 
  Glasses, 
  Gamepad2, 
  BookOpen, 
  Sparkles, 
  Languages,
  Play,
  Volume2,
  Clock,
  Zap,
  ChevronRight
} from 'lucide-react'

export const Route = createFileRoute('/immersive')({
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
  component: ImmersivePage,
})

function ImmersivePage() {
  const [activeMode, setActiveMode] = useState<'vr' | 'ar' | 'stories'>('vr')
  const [selectedLanguage, setSelectedLanguage] = useState('es')

  const { data: vrContent } = useQuery({
    queryKey: ['vr-content', selectedLanguage],
    queryFn: () => orpc.immersive.getVRMode.query({ language: selectedLanguage, scenario: 'all' }),
  })

  const { data: stories } = useQuery({
    queryKey: ['stories', selectedLanguage],
    queryFn: () => orpc.immersive.getInteractiveStories.query({ language: selectedLanguage, level: 'intermediate' }),
  })

  const { data: arFeatures } = useQuery({
    queryKey: ['ar-features', selectedLanguage],
    queryFn: () => orpc.immersive.getARMode.query({ language: selectedLanguage }),
  })

  const startStory = useMutation({
    mutationFn: (storyId: string) => orpc.immersive.startStorySession.mutate({ storyId, chapter: 1 }),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Glasses className="w-10 h-10 text-cyan-400" />
            Immersive Learning
          </h1>
          <p className="text-xl text-cyan-200 max-w-2xl mx-auto">
            Practice real-world conversations in VR environments, scan objects with AR, 
            and explore interactive stories.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveMode('vr')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeMode === 'vr' 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Glasses className="w-5 h-5 inline mr-2" />
            VR Mode
          </button>
          <button
            onClick={() => setActiveMode('ar')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeMode === 'ar' 
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Gamepad2 className="w-5 h-5 inline mr-2" />
            AR Mode
          </button>
          <button
            onClick={() => setActiveMode('stories')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeMode === 'stories' 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Stories
          </button>
        </div>

        <div className="mb-8 flex justify-center">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="es">🇪🇸 Spanish</option>
            <option value="fr">🇫🇷 French</option>
            <option value="de">🇩🇪 German</option>
            <option value="it">🇮🇹 Italian</option>
            <option value="ja">🇯🇵 Japanese</option>
            <option value="ko">🇰🇷 Korean</option>
            <option value="zh">🇨🇳 Chinese</option>
          </select>
        </div>

        {activeMode === 'vr' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vrContent?.scenarios?.map((scenario: any) => (
              <div 
                key={scenario.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex gap-2">
                    {scenario.availableVR && (
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">VR</span>
                    )}
                    {scenario.availableAR && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">AR</span>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
                <p className="text-white/70 mb-4">{scenario.description}</p>
                <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {scenario.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {scenario.difficulty}
                  </span>
                </div>
                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <p className="text-xs text-white/50 mb-2">Vocabulary:</p>
                  <div className="flex flex-wrap gap-1">
                    {scenario.vocabulary?.slice(0, 4).map((word: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-white/10 rounded text-sm">{word}</span>
                    ))}
                  </div>
                </div>
                <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/30">
                  <Play className="w-5 h-5" />
                  Start Scenario
                </button>
              </div>
            ))}
          </div>
        )}

        {activeMode === 'stories' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories?.stories?.map((story: any) => (
              <div 
                key={story.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full capitalize">
                      {story.genre}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                <p className="text-white/70 mb-4">{story.level} level • {story.chapters} chapters</p>
                <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {story.totalXP} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {story.completedChapters}/{story.chapters} chapters
                  </span>
                </div>
                <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(story.completedChapters / story.chapters * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${story.completedChapters / story.chapters * 100}%` }}
                    />
                  </div>
                </div>
                <button className="w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-pink-500/30">
                  <Play className="w-5 h-5" />
                  {story.completedChapters > 0 ? 'Continue' : 'Start Reading'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeMode === 'ar' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arFeatures?.features?.map((feature: any) => (
              <div 
                key={feature.id}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all ${
                  feature.available ? 'hover:bg-white/20' : 'opacity-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-purple-400" />
                  </div>
                  {feature.available ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Available</span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">Coming Soon</span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70 mb-4">{feature.description}</p>
                <button 
                  disabled={!feature.available}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-white/10 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {feature.available ? 'Launch AR' : 'Coming Soon'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Languages className="w-8 h-8 text-cyan-400" />
            Why Immersive Learning?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗣️</span>
              </div>
              <h3 className="font-bold mb-2">Real Conversations</h3>
              <p className="text-white/70">Practice speaking with AI in realistic scenarios you'll actually encounter.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👀</span>
              </div>
              <h3 className="font-bold mb-2">Visual Context</h3>
              <p className="text-white/70">See vocabulary in context with AR labels and real-world connections.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="font-bold mb-2">Engaging Stories</h3>
              <p className="text-white/70">Learn through narrative with choices that affect the story's outcome.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
