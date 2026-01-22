import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const R2_ENDPOINT = `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

export interface UploadOptions {
  key: string
  body: Buffer | Uint8Array | string
  contentType?: string
  metadata?: Record<string, string>
}

export async function uploadToR2(options: UploadOptions): Promise<string> {
  const { key, body, contentType, metadata } = options

  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
  })

  await s3Client.send(command)

  // Return public URL if configured, otherwise return key
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL
  return publicUrl ? `${publicUrl}/${key}` : key
}

export async function getR2Object(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: key,
  })

  const response = await s3Client.send(command)
  const arrayBuffer = await response.Body!.transformToByteArray()
  return Buffer.from(arrayBuffer)
}

export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: key,
  })

  await s3Client.send(command)
}

export async function getR2PresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}
