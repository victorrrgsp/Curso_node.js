import { AppError } from "@/common/domain/erros/app-erro"
import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(['development','production','test']).default('development'),
    // o coerce consegue ver q dentro do .env tem um number mesmo sendo string
    PORT: z.coerce.number().default(3333),
    API_URL: z.string().default('http://localhost:3333')
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    throw new AppError('Invalid environment variables')
}