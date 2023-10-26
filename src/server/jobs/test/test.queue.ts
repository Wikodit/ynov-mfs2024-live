import { Queue } from 'bullmq';

const testQueue = new Queue('test', {
  defaultJobOptions: {
    attempts: 1,
  },
});

export default testQueue;
