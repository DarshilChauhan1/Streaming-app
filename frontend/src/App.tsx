import './App.css';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import UploadVideo from './pages/UploadVideo';
import NotFound from './pages/NotFound';
import Player from './pages/Player';

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home/:id" element={<Player />} />
      <Route path="/upload" element={<UploadVideo />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
