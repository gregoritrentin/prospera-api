import { z } from 'zod'

export const envSchema = z.object({

  //AUTH
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  //DATABASE
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string(),

  //STORAGE
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),

  //EMAIL
  SENDGRID_API_KEY: z.string(),
  SENDGRID_FROM_EMAIL: z.string().email().default('oi@prosperatecnologia.com.br'),

  //SICREDI 
  SICREDI_COOPERATIVA: z.string(),
  SICREDI_BENEFICIARIO: z.string(),
  SICREDI_POSTO: z.string(),

  SICREDI_CHAVE_PIX: z.string(),

  SICREDI_CLIENT_ID: z.string(),
  SICREDI_CLIENT_SECRET: z.string(),

  SICREDI_MULTIPAG_CLIENT_ID: z.string(),
  SICREDI_MULTIPAG_CLIENT_SECRET: z.string(),

  SICREDI_API_KEY: z.string(),
  SICREDI_CODIGO_ACESSO: z.string(),

  SICREDI_BOLETO_API: z.string(),
  SICREDI_PIX_API: z.string(),
  SICREDI_MULTIPAG_API: z.string(),
  SICREDI_MULTIPAG_AUTH: z.string(),

  SICREDI_CERT: z.string(),
  SICREDI_KEY: z.string(),
  SICREDI_CA: z.string(),

  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>