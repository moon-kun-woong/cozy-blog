import Elysia from "elysia";
import { App } from "../../type";

export function createBase(prefix: string): App {
  return new Elysia({ prefix });
}
