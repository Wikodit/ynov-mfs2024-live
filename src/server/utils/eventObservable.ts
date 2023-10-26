import { type EventEmitter } from 'node:events';

type EmitterKeys<T extends EventEmitter> = Parameters<T['on']>[0];
type EmitterMap<T extends EventEmitter> = {
  [K in EmitterKeys<T>]: Parameters<T['on']>;
};

/**
 *
 */
export default function eventObservable<T extends EventEmitter>(
  emitter: T,
  eventHandlers: { [K: Parameters<T['on']>[0]]: string },
) {}
