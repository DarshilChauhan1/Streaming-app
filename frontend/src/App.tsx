import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import UploadVideo from './components/UploadVideo';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/home" element={<Home/>} />
      <Route path='/upload' element={<UploadVideo />} />
      <Route path='*' element={<NotFound/>} />
    </Routes>
  );
}

export default App;