import type { Metadata } from 'next'

export interface PageMetadataOptions {
  title: string
  description: string
  path?: string
}

export function createPageMetadata(options: PageMetadataOptions): Metadata {
  return {
    title: {
      default: options.title,
      template: `%s | ${options.title}`,
    },
    description: options.description,
    openGraph: {
      title: options.title,
      description: options.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
    },
  }
}
