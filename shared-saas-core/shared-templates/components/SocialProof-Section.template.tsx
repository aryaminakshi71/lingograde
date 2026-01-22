'use client'

import { Star, Quote } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

interface SocialProofSectionProps {
  testimonials: Testimonial[]
  customerLogos?: string[]
  stats?: Array<{ value: string; label: string }>
  title?: string
}

export default function SocialProofSection({
  testimonials,
  customerLogos = [],
  stats = [],
  title = 'Trusted by Leading Companies'
}: SocialProofSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        {stats.length > 0 && (
          <div className="text-center mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Logos */}
        {customerLogos.length > 0 && (
          <div className="text-center mb-16">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-8">
              {title}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              {customerLogos.map((logo, index) => (
                <div key={index} className="h-12 flex items-center">
                  <img src={logo} alt={`Customer ${index + 1}`} className="h-8 max-w-[120px] object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              What Our Customers Say
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-gray-300 mb-4" />
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

