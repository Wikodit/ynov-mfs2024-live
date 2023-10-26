import SocketIO from './SocketIO';
import TRpc from './TRpc';

export const HomePage: React.FC = () => {
  return (
    <div>
      <TRpc />
      <hr />
      <SocketIO />
    </div>
  );
};

export default HomePage;
