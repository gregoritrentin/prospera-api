import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  SENDGRID_API_KEY: z.string(),
  SENDGRID_FROM_EMAIL: z.string().email().default('nao-responda@prosperaerp.com'),

  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),

  //CLOUDFLARE_ACCOUNT_ID: z.string(),
  //AWS_BUCKET_NAME: z.string(),
  //AWS_ACCESS_KEY_ID: z.string(),
  //AWS_SECRET_ACCESS_KEY: z.string(),

  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>