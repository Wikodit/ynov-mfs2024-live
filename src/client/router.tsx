import { Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
    </Routes>
  );
};

export default Router;
