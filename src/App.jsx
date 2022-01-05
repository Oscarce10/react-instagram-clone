import React from 'react';
import { ListOfCategories } from './components/ListOfCategories';
import { GlobalStyle } from './GlobalStyles';
import { ListOfPhotoCards } from './components/ListOfPhotoCards';
import Logo from './components/Logo';
import { GopherSvg } from './components/Logo/Gopher';

const App = () => (
  <div>
    <GlobalStyle />
    <Logo />
    <GopherSvg />
    <ListOfCategories />
    <ListOfPhotoCards />
  </div>
);

export default App;
