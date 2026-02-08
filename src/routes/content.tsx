import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Video, Headphones, BookOpen, FileText, CheckCircle, Play, Volume2, Clock } from 'lucide-react'

export const Route = createFileRoute('/content')({
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
  component: ContentPage,
})

function ContentPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'videos' | 'podcasts' | 'reading'>('news')
  const [selectedLanguage, setSelectedLanguage] = useState('es')

  const { data: news } = useQuery({
    queryKey: ['news', selectedLanguage],
    queryFn: () => orpc.nativeContent.getNewsArticles.query({ language: selectedLanguage }),
  })

  const { data: videos } = useQuery({
    queryKey: ['videos', selectedLanguage],
    queryFn: () => orpc.nativeContent.getVideos.query({ language: selectedLanguage }),
  })

  const { data: podcasts } = useQuery({
    queryKey: ['podcasts', selectedLanguage],
    queryFn: () => orpc.nativeContent.getPodcasts.query({ language: selectedLanguage }),
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Native Content</h1>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white border rounded-lg px-4 py-2"
          >
            <option value="es">🇪🇸 Spanish</option>
            <option value="fr">🇫🇷 French</option>
            <option value="de">🇩🇪 German</option>
            <option value="ja">🇯🇵 Japanese</option>
          </select>
        </div>

        <div className="flex gap-4 mb-6">
          {[
            { id: 'news', label: 'News', icon: FileText },
            { id: 'videos', label: 'Videos', icon: Video },
            { id: 'podcasts', label: 'Podcasts', icon: Headphones },
            { id: 'reading', label: 'Reading', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'news' && (
          <div className="grid md:grid-cols-2 gap-6">
            {news?.articles?.map((article: any) => (
              <div key={article.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {article.imageUrl && (
                  <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                      {article.category}
                    </span>
                    <span>{article.readingTime} min read</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.source}</span>
                    <button className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700">
                      <Play className="w-4 h-4" />
                      Start Reading
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos?.videos?.map((video: any) => (
              <div key={video.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {Math.round(video.duration / 60)} min
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-emerald-600 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                  <div className="flex items-center gap-2">
                    {video.subtitles?.map((sub: any) => (
                      <span key={sub.language} className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {sub.language.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'podcasts' && (
          <div className="grid md:grid-cols-2 gap-6">
            {podcasts?.episodes?.map((podcast: any) => (
              <div key={podcast.id} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex gap-4">
                  <img src={podcast.imageUrl} alt={podcast.title} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Clock className="w-4 h-4" />
                      {Math.round(podcast.duration / 60)} min
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">
                        {podcast.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{podcast.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{podcast.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <button className="flex items-center gap-2 text-emerald-600 font-medium">
                    <Volume2 className="w-5 h-5" />
                    Listen Now
                  </button>
                  <span className="text-sm text-gray-500">
                    {podcast.discussionQuestions?.length || 0} discussion questions
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
