import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import HomePage from './views/HomePage';
import FriendPage from './views/FriendPage';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/friend" element={<FriendPage />} />
      </Routes>
    </Router>
  );
}

export default App;