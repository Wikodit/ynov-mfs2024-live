import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? 'anonymous' };
  return { req, res, user };
}
export type Context = inferAsyncReturnType<typeof createContext>;
