import type { Config } from 'drizzle-kit'

export default {
  dialect: 'sqlite',
  driver: 'd1',
  schema: './src/domain/blog/entity/index.ts',
  out: './migrations'
} satisfies Config
