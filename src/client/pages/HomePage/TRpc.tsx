import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { useState } from 'react';

import { trpc } from '../../utils/trpc';

export const TRpc: React.FC = () => {
  const queryClient = useQueryClient();

  const myUserId = 'id_bilbo';

  const { data: myUser } = trpc.getUserById.useQuery(myUserId);
  const { data: allUsers } = trpc.getAllUser.useQuery();

  const userCreator = trpc.createUser.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.getAllUser),
      });
    },
  });

  const [randomNumber, setRandomNumber] = useState(Number.NaN);

  trpc.randomNumber.useSubscription(undefined, {
    onData(data) {
      setRandomNumber(data.randomNumber);
    },
  });

  const createUser = async (name: string) => {
    await userCreator.mutateAsync({ name });
  };

  return (
    <div>
      <h2>TRPC</h2>
      <h3>Hello {myUser?.name}!</h3>
      <p>Here's a random number from the server {randomNumber}, happy?</p>
      <ul>{allUsers?.map((user) => <li key={user.id}>{user.name}</li>)}</ul>

      <button onClick={() => createUser('Frodo')}>Create Frodo</button>
    </div>
  );
};

export default TRpc;
