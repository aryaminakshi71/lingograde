import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Award, Share2, Download, ExternalLink, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/certificates')({
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
  component: CertificatesPage,
})

function CertificatesPage() {
  const { data: certificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => orpc.certification.getCertificates.query({}),
  })

  const { data: prepCourses } = useQuery({
    queryKey: ['prepCourses'],
    queryFn: () => orpc.certification.getExamPrepCourses.query({ language: 'es' }),
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-500" />
          My Certificates
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {certificates?.certificates?.map((cert: any) => (
            <div key={cert.id} className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{cert.title}</h3>
                  <p className="opacity-90">{cert.level} Level</p>
                </div>
                <Award className="w-12 h-12 opacity-80" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Score: {cert.score}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm opacity-80">ID: {cert.verificationCode}</div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Exam Preparation</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {prepCourses?.courses?.map((course: any) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                    {course.exam}
                  </span>
                  <h3 className="text-xl font-bold mt-2">{course.title}</h3>
                </div>
                <span className="text-2xl font-bold text-emerald-600">${course.price}</span>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{course.duration}</span>
                <span>{course.lessons} lessons</span>
              </div>
              <div className="space-y-2 mb-6">
                {course.includes?.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Start Preparation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
