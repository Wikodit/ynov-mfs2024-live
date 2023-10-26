import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyCompress from '@fastify/compress';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import createFastify from 'fastify';
import fastifyIO from 'fastify-socket.io';

import { createContext } from './context.js';
import vitePlugin from './plugins/vitePlugin.js';
import { appRouter } from './router.js';
import handleSocketIo, { type IoServer } from './socketio.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const resolveRoot = (p: string) => path.resolve(dirname, '../..', p);

declare module 'fastify' {
  interface FastifyInstance {
    io: IoServer;
  }
}

/**
 *
 * @param isProduction
 */
async function createServer(
  isProduction = process.env.NODE_ENV === 'production',
) {
  const fastify = createFastify();

  await fastify.register(fastifyIO);

  await fastify.register(ws);
  // Allow usage of express middleware
  await fastify.register(fastifyMiddie);

  if (isProduction) {
    await fastify.register(fastifyCompress);
    await fastify.register(fastifyStatic, {
      root: resolveRoot('dist/client'),
      prefix: '/',
    });
  } else {
    await fastify.register(fastifyStatic, {
      root: resolveRoot('src/client/assets'),
      prefix: '/assets',
    });
  }

  await fastify.register(vitePlugin, { production: isProduction });

  await fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    useWSS: true,
    trpcOptions: { router: appRouter, createContext },
  });

  const port = +(process.env.PORT ?? 7456);
  await fastify.listen({ port, host: '0.0.0.0' });

  handleSocketIo(fastify.io);

  console.log(`App is listening on http://localhost:${port}`);
}

try {
  await createServer();
} catch (error) {
  console.error(error);
}
