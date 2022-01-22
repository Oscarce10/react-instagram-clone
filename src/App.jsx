import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';

const App = () => (
  <div>
    <Header />
    <Outlet />
    <NavBar />
  </div>
);

export default App;
