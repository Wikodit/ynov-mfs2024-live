import { observable } from '@trpc/server/observable';
import { z } from 'zod';

import { publicProcedure, router } from './trpc.js';

type User = {
  id: string;
  name: string;
  bio?: string;
};

const users: Record<string, User> = {};

export const appRouter = router({
  getAllUser: publicProcedure.query(() => {
    return Object.values(users);
  }),
  getUserById: publicProcedure.input(z.string()).query((options) => {
    return users[options.input] ?? null; // input type is string
  }),
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(3),
        bio: z.string().max(142).optional(),
      }),
    )
    .mutation((options) => {
      const id = Date.now().toString();
      const user: User = { id, ...options.input };
      users[user.id] = user;
      return user;
    }),
  randomNumber: publicProcedure.subscription(() => {
    return observable<{ randomNumber: number }>((emit) => {
      const timer = setInterval(() => {
        emit.next({ randomNumber: Math.ceil(Math.random() * 100_000) });
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
