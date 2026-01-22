interface KVOptions {
  namespaceId: string
  accountId: string
  authToken: string
}

class CloudflareKV {
  private namespaceId: string
  private accountId: string
  private authToken: string
  private baseUrl: string

  constructor(options: KVOptions) {
    this.namespaceId = options.namespaceId
    this.accountId = options.accountId
    this.authToken = options.authToken
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/storage/kv/namespaces/${this.namespaceId}`
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`KV request failed: ${response.statusText}`)
    }

    return response
  }

  async get(key: string): Promise<string | null> {
    const response = await this.request(`/values/${key}`)
    return response.text()
  }

  async put(key: string, value: string, options?: { expirationTtl?: number; expiration?: number }): Promise<void> {
    const headers: Record<string, string> = {}
    
    if (options?.expirationTtl) {
      headers['expiration-ttl'] = options.expirationTtl.toString()
    }
    if (options?.expiration) {
      headers['expiration'] = options.expiration.toString()
    }

    await this.request(`/values/${key}`, {
      method: 'PUT',
      body: value,
      headers,
    })
  }

  async delete(key: string): Promise<void> {
    await this.request(`/keys/${key}`, {
      method: 'DELETE',
    })
  }

  async list(prefix?: string): Promise<{ keys: Array<{ name: string }> }> {
    const url = prefix ? `/keys?prefix=${prefix}` : '/keys'
    const response = await this.request(url)
    return response.json()
  }
}

// Create singleton instance
let kvInstance: CloudflareKV | null = null

export function getKV(): CloudflareKV {
  if (!kvInstance) {
    if (!process.env.CLOUDFLARE_KV_NAMESPACE_ID || !process.env.CLOUDFLARE_KV_ACCOUNT_ID || !process.env.CLOUDFLARE_KV_AUTH_TOKEN) {
      throw new Error('Cloudflare KV credentials not configured')
    }

    kvInstance = new CloudflareKV({
      namespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
      accountId: process.env.CLOUDFLARE_KV_ACCOUNT_ID,
      authToken: process.env.CLOUDFLARE_KV_AUTH_TOKEN,
    })
  }

  return kvInstance
}

// Helper functions
export async function kvGet(key: string): Promise<string | null> {
  return getKV().get(key)
}

export async function kvPut(key: string, value: string, ttl?: number): Promise<void> {
  return getKV().put(key, value, ttl ? { expirationTtl: ttl } : undefined)
}

export async function kvDelete(key: string): Promise<void> {
  return getKV().delete(key)
}

export async function kvList(prefix?: string) {
  return getKV().list(prefix)
}
