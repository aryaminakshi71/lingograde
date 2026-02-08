import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Users, MessageCircle, Gamepad2, Globe } from 'lucide-react'

export const Route = createFileRoute('/community')({
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
  component: CommunityPage,
})

function CommunityPage() {
  const { data: exchangeMatches } = useQuery({
    queryKey: ['languageExchange'],
    queryFn: () => orpc.community.findLanguageExchange.query({
      myLanguage: 'en',
      targetLanguage: 'es',
    }),
  })

  const { data: studyGroups } = useQuery({
    queryKey: ['studyGroups'],
    queryFn: () => orpc.community.getStudyGroups.query({}),
  })

  const { data: friends } = useQuery({
    queryKey: ['friends'],
    queryFn: () => orpc.community.getFriends.query({}),
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-500" />
          Community
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-bold">Language Exchange</h3>
                <p className="text-sm text-gray-500">Find conversation partners</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {exchangeMatches?.total || 0}
            </div>
            <div className="text-sm text-gray-500 mb-4">potential partners</div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-medium">
              Find Partners
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-8 h-8 text-emerald-500" />
              <div>
                <h3 className="font-bold">Study Groups</h3>
                <p className="text-sm text-gray-500">Join group learning</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-600">
              {studyGroups?.total || 0}
            </div>
            <div className="text-sm text-gray-500 mb-4">active groups</div>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl font-medium">
              Browse Groups
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="w-8 h-8 text-amber-500" />
              <div>
                <h3 className="font-bold">Friends</h3>
                <p className="text-sm text-gray-500">Challenge & compete</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-600">
              {friends?.total || 0}
            </div>
            <div className="text-sm text-gray-500 mb-4">friends</div>
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-medium">
              View All
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Language Exchange Matches</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {exchangeMatches?.matches?.map((match: any) => (
            <div key={match.id} className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <img src={match.avatar} alt={match.name} className="w-14 h-14 rounded-full" />
                <div>
                  <h3 className="font-bold">{match.name}</h3>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {match.status}
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Speaks</span>
                  <span>{match.nativeLanguage.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Learning</span>
                  <span>{match.learningLanguage.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">XP</span>
                  <span>{match.totalXP.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Streak</span>
                  <span>{match.currentStreak} days</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium">
                  Connect
                </button>
                <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                  Challenge
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">Popular Study Groups</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {studyGroups?.groups?.map((group: any) => (
            <div key={group.id} className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.language} • {group.level}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                  {group.members}/{group.maxMembers}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{group.description}</p>
              {group.schedule && (
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                  <span>📅</span>
                  {group.schedule}
                </div>
              )}
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl font-medium">
                Join Group
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
