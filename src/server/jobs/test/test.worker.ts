import { Worker } from 'bullmq';

const worker = new Worker(
  'tesst',
  async (job) => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    console.log(job.data);
  },
  {
    limiter: {
      max: 1,
      duration: 3_600_000,
    },
  },
);

worker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, error) => {
  console.log(`${job?.id} has failed with ${error.message}`);
});

export default worker;
