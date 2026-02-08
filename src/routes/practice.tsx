import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Send, Mic, Volume2, RefreshCw, Sparkles, MessageCircle, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/practice')({
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
  component: PracticePage,
})

function PracticePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es')
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [practiceMode, setPracticeMode] = useState<'chat' | 'conversation' | 'translate'>('chat')

  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: () => orpc.lessons.getLanguages.query(),
  })

  const sendMessage = useMutation({
    mutationFn: async (msg: string) => {
      setConversation(prev => [...prev, { role: 'user', content: msg }])
      setIsTyping(true)
      setMessage('')

      const result = await orpc.aiTutor.chat.mutate({
        message: msg,
        languageCode: selectedLanguage,
        conversationHistory: conversation,
      })

      setIsTyping(false)
      setConversation(prev => [...prev, { role: 'assistant', content: result.response }])
    },
    onError: () => {
      setIsTyping(false)
    },
  })

  const generateConversation = useMutation({
    mutationFn: async () => {
      const result = await orpc.aiTutor.generateConversation.mutate({
        languageCode: selectedLanguage,
        topic: 'Ordering food at a restaurant',
        difficulty: 'intermediate',
      })
      return result.scenario
    },
  })

  const translateText = useMutation({
    mutationFn: async (text: string) => {
      const result = await orpc.aiTutor.translateSentence.mutate({
        sentence: text,
        sourceLanguage: 'en',
        targetLanguage: selectedLanguage,
      })
      return result
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-gray-100 rounded-lg px-4 py-2 font-medium"
            >
              {languages?.map((lang: any) => (
                <option key={lang.id} value={lang.code}>
                  {lang.flagEmoji} {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPracticeMode('chat')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                practiceMode === 'chat' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setPracticeMode('conversation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                practiceMode === 'conversation' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Role-play
            </button>
            <button
              onClick={() => setPracticeMode('translate')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                practiceMode === 'translate' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Translate
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {practiceMode === 'chat' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-[600px] overflow-y-auto p-6 space-y-4">
              {conversation.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">Start Practicing!</h3>
                  <p>Chat with your AI tutor in {selectedLanguage.toUpperCase()}</p>
                </div>
              )}
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-6 py-3 ${
                      msg.role === 'user'
                        ? 'bg-emerald-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-6 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && message.trim() && sendMessage.mutate(message)}
                  placeholder={`Type a message in ${selectedLanguage.toUpperCase()}...`}
                  className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => message.trim() && sendMessage.mutate(message)}
                  disabled={!message.trim() || sendMessage.isPending}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white p-4 rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {practiceMode === 'conversation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">Conversation Practice</h2>
              <p className="text-gray-600 mb-6">
                Generate a role-play scenario to practice real-world conversations.
              </p>
              <button
                onClick={() => generateConversation.mutate()}
                disabled={generateConversation.isPending}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                {generateConversation.isPending ? 'Generating...' : 'Generate Scenario'}
              </button>
            </div>

            {generateConversation.data && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4">{generateConversation.data.title}</h3>
                <p className="text-gray-600 mb-4">{generateConversation.data.scenario}</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold mb-2">Example Dialogue</h4>
                  {generateConversation.data.exampleDialogue?.map((line: any, i: number) => (
                    <div key={i} className="mb-3">
                      <div className="font-medium text-emerald-700">{line.speaker}: {line.text}</div>
                      <div className="text-sm text-gray-500">{line.translation}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-2 text-blue-900">Vocabulary</h4>
                    <div className="flex flex-wrap gap-2">
                      {generateConversation.data.vocabulary?.map((word: string, i: number) => (
                        <span key={i} className="bg-white px-3 py-1 rounded-lg text-sm">{word}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-2 text-amber-900">Useful Phrases</h4>
                    <div className="space-y-1">
                      {generateConversation.data.phrasesToLearn?.map((phrase: string, i: number) => (
                        <div key={i} className="text-sm">{phrase}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {practiceMode === 'translate' && (
          <TranslationMode languageCode={selectedLanguage} translateFn={translateText.mutateAsync} />
        )}
      </div>
    </div>
  )
}

function TranslationMode({ languageCode, translateFn }: { languageCode: string; translateFn: (text: string) => Promise<any> }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleTranslate = async () => {
    if (!input.trim()) return
    const res = await translateFn(input)
    setResult(res)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="p-6 border-r">
          <h3 className="font-semibold text-gray-500 mb-2">English</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-64 resize-none focus:outline-none text-lg"
          />
          <button
            onClick={handleTranslate}
            disabled={!input.trim()}
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Translate to {languageCode.toUpperCase()}
          </button>
        </div>
        <div className="p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-500 mb-2">{languageCode.toUpperCase()}</h3>
          {result ? (
            <div className="space-y-4">
              <div className="text-2xl font-medium">{result.translation}</div>
              <div className="text-gray-500">{result.literalTranslation}</div>
              {result.explanation && (
                <div className="text-sm bg-blue-50 p-3 rounded-lg">{result.explanation}</div>
              )}
              <button className="text-emerald-600 hover:text-emerald-700">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Translation will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
