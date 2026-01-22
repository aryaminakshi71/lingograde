'use client'

import { useEffect, useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { CommandPalette } from '@shared/saas-core'
import { GraduationCap, BookOpen, Brain, Check, Zap, ArrowRight, CreditCard, Shield, Globe, BarChart3, FileText, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../../lib/languages'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../../lib/orpc-query'

// Feature cards
const features = [
  {
    icon: Brain,
    title: 'AI Learning',
    description: 'Personalized learning paths powered by AI.',
    badge: 'AI',
    href: '/dashboard',
  },
  {
    icon: BookOpen,
    title: 'Language Courses',
    description: 'Learn 10+ languages with expert content.',
    badge: 'Courses',
    href: '/dashboard',
  },
  {
    icon: GraduationCap,
    title: 'Progress Tracking',
    description: 'Track your learning progress and achievements.',
    badge: 'Progress',
    href: '/dashboard',
  },
  {
    icon: Check,
    title: 'Speaking Practice',
    description: 'Practice speaking with AI-powered feedback.',
    badge: 'Speaking',
    href: '/dashboard',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [commandOpen, setCommandOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  // Fetch languages from API
  const { data: apiLanguages, isLoading } = useQuery(orpc.lessons.getLanguages.queryOptions())

  // Merge API languages with static data
  const displayLanguages = LANGUAGES.map(lang => {
    const apiLang = apiLanguages?.find((al: { code: string }) => al.code === lang.code)
    return {
      ...lang,
      apiData: apiLang,
    }
  })

  const selectedLangData = selectedLanguage
    ? displayLanguages.find(l => l.code === selectedLanguage)
    : displayLanguages[0]

  // Safety check: ensure selectedLangData exists and has required properties
  const safeSelectedLangData = selectedLangData && selectedLangData.levels ? selectedLangData : null

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100/50 sticky top-0 bg-white/90 backdrop-blur-xl shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LingoGrade</span>
            </Link>
            <div className="flex items-center space-x-8">
              <a href="#features" className="text-gray-600 font-medium hover:text-gray-900 no-underline hidden md:block">Features</a>
              <a href="#languages" className="text-gray-600 font-medium hover:text-gray-900 no-underline hidden md:block">Languages</a>
              <a href="#pricing" className="text-gray-600 font-medium hover:text-gray-900 no-underline hidden md:block">Pricing</a>
              <Link to="/demo" className="text-gray-600 font-medium hover:text-gray-900 no-underline">Try Demo</Link>
              <Link to="/login" className="text-gray-600 font-medium hover:text-gray-900 no-underline">Sign In</Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Any Language with
              <span className="text-emerald-600"> AI-Powered Learning</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Learn 10+ languages with personalized lessons, speech recognition, and real-time feedback. Start your journey today.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose LingoGrade?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <Link
                  key={idx}
                  to={feature.href}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 no-underline block cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {feature.title}
                    </h3>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {feature.badge}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Languages Section */}
        <section id="languages" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Language</h2>
              <p className="text-xl text-gray-600">Start learning any of 12+ languages with courses designed for all skill levels</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayLanguages.slice(0, 12).map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedLanguage(lang.code)
                  }}
                  className={`group text-left bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                    selectedLanguage === lang.code
                      ? 'border-emerald-500 shadow-lg'
                      : 'border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{lang.flag}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{lang.name}</h3>
                      <p className="text-gray-600 text-sm">{lang.nativeName}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lang.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(lang.features || []).slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>👥 {lang.learners || 'N/A'} learners</span>
                    <span>⏱️ {lang.timeToFluency || 'N/A'}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Curriculum Detail Section */}
            {safeSelectedLangData && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">{safeSelectedLangData.flag}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Learn {safeSelectedLangData.name}</h2>
                    <p className="text-gray-600 mt-1">{safeSelectedLangData.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">{safeSelectedLangData.speakers}</div>
                    <div className="text-sm text-gray-600 mt-1">Native Speakers</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">{safeSelectedLangData.wordsToLearn?.toLocaleString() || 'N/A'}</div>
                    <div className="text-sm text-gray-600 mt-1">Words to Learn</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">{safeSelectedLangData.timeToFluency}</div>
                    <div className="text-sm text-gray-600 mt-1">Time to Fluency</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Curriculum</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {safeSelectedLangData.levels?.map((level, index) => (
                      <div
                        key={index}
                        className="group p-5 border-2 border-gray-100 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => navigate({ to: '/dashboard', search: { language: safeSelectedLangData.code, level: level.name } })}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-600">
                              {level.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">{level.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{level.lessons} lessons</span>
                              <span>•</span>
                              <span>{level.hours} hours</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors no-underline"
                  >
                    Start Learning {safeSelectedLangData.name}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>5 lessons per day</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Basic exercises</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Progress tracking</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors no-underline"
                >
                  Get Started
                </Link>
              </div>

              <div className="bg-emerald-600 rounded-2xl p-8 border-2 border-emerald-600 relative">
                <div className="absolute top-0 right-0 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-2xl">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-4">$19.99<span className="text-lg text-emerald-100">/month</span></div>
                <p className="text-emerald-100 mb-6">Best for serious learners</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5" />
                    <span>Unlimited lessons</span>
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5" />
                    <span>AI-powered learning</span>
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5" />
                    <span>Speech recognition</span>
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5" />
                    <span>Offline mode</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="block w-full text-center bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors no-underline"
                >
                  Start Free Trial
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Team</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$49.99<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600 mb-6">For businesses and schools</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Up to 10 members</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Admin dashboard</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors no-underline"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
