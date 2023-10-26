import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { type FastifyPluginAsync } from 'fastify';
import { type RouteHandler } from 'fastify';
import fp from 'fastify-plugin';
import { createServer as createViteServer } from 'vite';

type VitePluginOptions = {
  production: boolean;
};

const dirname = path.dirname(fileURLToPath(import.meta.url));
const resolveRoot = (p: string) => path.resolve(dirname, '../../..', p);

const vitePluginAsync: FastifyPluginAsync<VitePluginOptions> = async (
  fastify,
  { production },
) => {
  const isTest =
    process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;

  const getStyleSheets = async () => {
    try {
      const assetpath = resolveRoot('dist/assets');
      const files = await fs.readdir(assetpath);
      const cssAssets = files.filter((l) => l.endsWith('.css'));
      const allContent = await Promise.all(
        cssAssets.map((asset) =>
          fs.readFile(path.join(assetpath, asset), 'utf8'),
        ),
      );

      return allContent.join('\n');
    } catch {
      return '';
    }
  };

  const stylesheets = getStyleSheets();

  const renderViteApp: RouteHandler = async (request, reply) => {
    const url = request.url ?? '';

    try {
      // 1. Read index.html
      let template = await fs.readFile(
        production
          ? resolveRoot('dist/client/index.html')
          : resolveRoot('index.html'),
        'utf8',
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const productionBuildPath = resolveRoot('./dist/server/entry-server.mjs');
      const developmentBuildPath = resolveRoot('./src/client/entry-server.tsx');
      const { render } = await vite.ssrLoadModule(
        production ? productionBuildPath : developmentBuildPath,
      );

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const appHtml = await render(url);
      const cssAssets = production ? '' : await stylesheets;

      // 5. Inject the app-rendered HTML into the template.
      const html = template
        .replace(`<!--app-html-->`, appHtml)
        .replace(`<!--head-->`, cssAssets);

      // 6. Send the rendered HTML back.
      return reply.code(200).header('Content-Type', 'text/html').send(html);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (!production) {
          vite.ssrFixStacktrace(error);
        }
        console.log(error.stack);
      }
      throw error;
    }
  };

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: isTest ? 'error' : 'info',
  });

  fastify.use(vite.middlewares);

  fastify.get('*', renderViteApp);
};

export default fp(vitePluginAsync, '4.x');
