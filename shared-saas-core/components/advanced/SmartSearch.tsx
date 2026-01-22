'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Command, ArrowRight } from 'lucide-react'
import { cn, debounce } from '../../utils'

interface SearchResult {
  id: string
  title: string
  description?: string
  category: string
  href: string
  icon?: string
}

interface SmartSearchProps {
  placeholder?: string
  onSearch?: (query: string) => Promise<SearchResult[]>
  onSelect?: (result: SearchResult) => void
  className?: string
  hotkey?: string
}

export function SmartSearch({
  placeholder = 'Search...',
  onSearch,
  onSelect,
  className,
  hotkey = 'k',
}: SmartSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Debounced search
  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim() || !onSearch) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const searchResults = await onSearch(searchQuery)
      setResults(searchResults)
      setSelectedIndex(0)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, 300)

  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === hotkey) {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }

      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
        setResults([])
      }

      // Navigate results
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex])
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, hotkey])

  // Scroll selected into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const handleSelect = (result: SearchResult) => {
    if (onSelect) {
      onSelect(result)
    } else {
      window.location.href = result.href
    }
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200',
          'bg-white hover:bg-gray-50 text-gray-500 text-sm',
          'transition-colors',
          className
        )}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">{placeholder}</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
          <Command className="w-3 h-3" />
          {hotkey.toUpperCase()}
        </kbd>
      </button>
    )
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-10 py-3 rounded-lg border border-gray-200',
            'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500',
            'text-gray-900 placeholder-gray-400'
          )}
          autoFocus
        />
        <button
          onClick={() => {
            setIsOpen(false)
            setQuery('')
            setResults([])
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {(results.length > 0 || loading || query) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-xl max-h-96 overflow-y-auto z-50">
          {loading && (
            <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
          )}

          {!loading && results.length > 0 && (
            <div ref={resultsRef} className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                    'flex items-center gap-3',
                    index === selectedIndex && 'bg-blue-50'
                  )}
                >
                  {result.icon && <span className="text-xl">{result.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{result.title}</div>
                    {result.description && (
                      <div className="text-sm text-gray-500 mt-0.5">{result.description}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">{result.category}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

