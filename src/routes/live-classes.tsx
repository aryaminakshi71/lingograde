import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Video, Calendar, Clock, Star, Users, DollarSign, Award, Play } from 'lucide-react'

export const Route = createFileRoute('/live-classes')({
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
  component: LiveClassesPage,
})

function LiveClassesPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'tutors' | 'groups'>('upcoming')

  const { data: upcomingClasses } = useQuery({
    queryKey: ['upcomingClasses'],
    queryFn: () => orpc.liveClasses.getUpcomingClasses.query({}),
  })

  const { data: tutors } = useQuery({
    queryKey: ['tutors'],
    queryFn: () => orpc.liveClasses.getTutors.query({}),
  })

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => orpc.liveClasses.getGroupClasses.query({}),
  })

  const bookClass = useMutation({
    mutationFn: (classId: string) => orpc.liveClasses.bookClass.mutate({ classId }),
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Live Classes & Tutoring</h1>
          <p className="text-gray-600">Practice with native speakers and expert tutors</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: 'upcoming', label: 'Upcoming Classes', icon: Calendar },
            { id: 'tutors', label: 'Find Tutors', icon: Star },
            { id: 'groups', label: 'Group Classes', icon: Users },
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

        {activeTab === 'upcoming' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingClasses?.classes?.map((cls: any) => (
              <div key={cls.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                      {cls.level}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {cls.currentParticipants}/{cls.maxParticipants}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cls.title}</h3>
                  <p className="text-gray-600 text-sm">{cls.description}</p>
                </div>
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={cls.tutor.avatar} alt={cls.tutor.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium">{cls.tutor.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        {cls.tutor.rating}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    {new Date(cls.scheduledAt).toLocaleString()}
                    <span className="ml-auto">{cls.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">${cls.price}</span>
                    <button
                      onClick={() => bookClass.mutate(cls.id)}
                      disabled={cls.currentParticipants >= cls.maxParticipants}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium"
                    >
                      {cls.currentParticipants >= cls.maxParticipants ? 'Full' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tutors' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors?.tutors?.map((tutor: any) => (
              <div key={tutor.id} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{tutor.name}</h3>
                      {tutor.isVerified && <Award className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{tutor.rating}</span>
                      <span className="text-gray-500 text-sm">({tutor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{tutor.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutor.specialties.map((spec: string) => (
                    <span key={spec} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold">${tutor.hourlyRate}<span className="text-sm font-normal text-gray-500">/hr</span></span>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium">
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-6">
            {groups?.groups?.map((group: any) => (
              <div key={group.id} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{group.schedule}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {group.members}/{group.maxMembers} members
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                        {group.level}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">${group.priceMonthly}</div>
                    <div className="text-sm text-gray-500">per month</div>
                    <button className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium">
                      Join Group
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
