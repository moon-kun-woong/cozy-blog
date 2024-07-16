import type Elysia from 'elysia'
import { type setup } from '../setup'

export type AnyElysia = Elysia<any, any, any, any, any, any, any, any>

export interface Controller {
  prefix: string
  register: (app: AnyElysia) => AnyElysia
}

export type App = ReturnType<typeof setup>