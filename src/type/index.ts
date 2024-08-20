import type Elysia from "elysia";
import { type setup } from "../setup";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyElysia = Elysia<any, any, any, any, any, any, any, any>;

export type App = ReturnType<typeof setup>;
