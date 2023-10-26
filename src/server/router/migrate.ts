import { observable } from '@trpc/server/observable';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { events, queue } from '../jobs/test';
import { publicProcedure, router } from '../trpc.js';

export const appRouter = router({
  createUser: publicProcedure.input(z.object({})).mutation(async (options) => {
    await queue.add(uuid(), {});
  }),
  progress: publicProcedure.subscription(() => {
    return observable<{ progress: number | object }>((emit) => {
      const onProgress = (args: { jobId: string; data: number | object }) =>
        emit.next({ progress: args.data });

      const onCompleted = (args: {
        jobId: string;
        returnvalue: string;
        prev?: string | undefined;
      }) => emit.complete();

      events.on('progress', onProgress);
      events.on('completed', onCompleted);

      let a: Parameters<(typeof events)['on']>[0] = {} as unknown;

      a = 'active';

      return () => {
        events.off('progress', onProgress);
        events.off('completed', onCompleted);
      };
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
