import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { ArrowLeft, ArrowRight, Clock, Trophy, Award, CheckCircle, XCircle } from 'lucide-react'

export const Route = createFileRoute('/exam')({
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
  component: ExamPage,
})

function ExamPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<number | null>(null)
  const [examType, setExamType] = useState<'placement' | 'level' | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(1800)
  const [showResults, setShowResults] = useState(false)
  const [examResult, setExamResult] = useState<any>(null)

  const { data: languages } = useQuery(orpc.lessons.getLanguages.queryOptions())

  const { data: placementTest } = useQuery({
    queryKey: ['placementTest', selectedLanguage],
    queryFn: () => orpc.exam.getPlacementTest.query({ languageId: selectedLanguage! }),
    enabled: !!selectedLanguage && examType === 'placement',
  })

  const { data: levelExam } = useQuery({
    queryKey: ['levelExam', selectedLanguage],
    queryFn: () => orpc.exam.getLevelExam.query({ courseId: selectedLanguage! }),
    enabled: !!selectedLanguage && examType === 'level',
  })

  const submitExam = useMutation({
    mutationFn: async (answers: Array<{ exerciseId: number; userAnswer: string; timeSpentSeconds: number }>) => {
      if (examType === 'placement') {
        return orpc.exam.submitPlacementTest.mutate({
          answers,
          languageId: selectedLanguage!,
        })
      } else {
        return orpc.exam.submitLevelExam.mutate({
          courseId: selectedLanguage!,
          answers,
        })
      }
    },
    onSuccess: (result) => {
      setExamResult(result)
      setShowResults(true)
    },
  })

  const exercises = examType === 'placement' ? placementTest?.exercises : levelExam?.exercises
  const totalQuestions = exercises?.length || 0

  const handleAnswer = (answer: string) => {
    if (!exercises) return
    setAnswers(prev => ({ ...prev, [exercises[currentQuestion].id]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    const answerArray = Object.entries(answers).map(([exerciseId, userAnswer]) => ({
      exerciseId: parseInt(exerciseId),
      userAnswer,
      timeSpentSeconds: 30,
    }))
    submitExam.mutate(answerArray)
  }

  if (!languages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (showResults && examResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              examResult.passed ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              {examResult.passed ? (
                <Trophy className="w-12 h-12 text-emerald-600" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">
              {examResult.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>

            <p className="text-gray-600 mb-6">
              {examResult.message}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-emerald-600">{examResult.score}%</div>
                <div className="text-sm text-gray-500">Your Score</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-3xl font-bold">{examResult.correctCount}/{examResult.totalQuestions}</div>
                <div className="text-sm text-gray-500">Correct Answers</div>
              </div>
              {examResult.xpEarned > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-amber-500">{examResult.xpEarned}</div>
                  <div className="text-sm text-gray-500">XP Earned</div>
                </div>
              )}
            </div>

            {examResult.certificateId && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-6 mb-6">
                <Award className="w-12 h-12 mx-auto mb-2 text-white" />
                <h3 className="text-xl font-bold text-white mb-1">Certificate Earned!</h3>
                <p className="text-white/80 text-sm">ID: {examResult.certificateId}</p>
              </div>
            )}

            {examResult.recommendedLevel && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-1">Recommended Level</h3>
                <p className="text-blue-700 capitalize">{examResult.recommendedLevel.replace('_', ' ')}</p>
              </div>
            )}

            <button
              onClick={() => {
                setShowResults(false)
                setExamResult(null)
                setSelectedLanguage(null)
                setExamType(null)
                setCurrentQuestion(0)
                setAnswers({})
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Take Another Exam
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!examType) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Language Exams</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setExamType('placement')}
              className="bg-white rounded-2xl shadow-xl p-8 text-left hover:shadow-2xl transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Placement Test</h2>
              <p className="text-gray-600 mb-4">
                Find your perfect starting level. Take a diagnostic test to assess your current skills.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 30 questions</li>
                <li>• 30 minutes</li>
                <li>• Instant results</li>
              </ul>
            </button>

            <button
              onClick={() => setExamType('level')}
              className="bg-white rounded-2xl shadow-xl p-8 text-left hover:shadow-2xl transition-shadow"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Level Exam</h2>
              <p className="text-gray-600 mb-4">
                Prove your mastery and earn a certificate for completing a course level.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 15 questions from course</li>
                <li>• 45 minutes</li>
                <li>• Earn certificate & XP</li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedLanguage && examType === 'placement') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setExamType(null)}
            className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>

          <h1 className="text-3xl font-bold text-center mb-8">Choose a Language</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {languages.map((lang: any) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-2">{lang.flagEmoji}</div>
                <div className="font-semibold">{lang.name}</div>
                <div className="text-sm text-gray-500">{lang.nativeName}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!selectedLanguage && examType === 'level') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setExamType(null)}
            className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>

          <h1 className="text-3xl font-bold text-center mb-8">Select a Course to Exam</h1>

          <div className="grid gap-4">
            {languages.map((lang: any) => (
              <div key={lang.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{lang.flagEmoji}</span>
                  <h3 className="text-xl font-bold">{lang.name}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className="bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-medium py-2 px-4 rounded-lg transition-colors capitalize"
                    >
                      {level.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  const currentExercise = exercises[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Question {currentQuestion + 1} of {totalQuestions}</span>
            <div className="flex items-center gap-2 text-orange-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono">{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  i === currentQuestion
                    ? 'bg-emerald-500 text-white'
                    : answers[exercises[i].id]
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-6">{currentExercise?.question}</h2>

          {currentExercise?.options && (
            <div className="space-y-3">
              {currentExercise.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 rounded-xl text-left transition-colors ${
                    answers[currentExercise.id] === option
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="inline-block w-8 h-8 bg-white/20 rounded-lg text-center leading-8 mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          )}

          {(!currentExercise?.options || currentExercise.exerciseType === 'fill_blank' || currentExercise.exerciseType === 'translation') && (
            <input
              type="text"
              value={answers[currentExercise?.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
            />
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Previous
            </button>

            {currentQuestion === totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitExam.isPending}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {submitExam.isPending ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
