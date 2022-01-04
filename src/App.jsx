import React from 'react';
import { ListOfCategories } from './components/ListOfCategories';
import { PhotoCard } from './components/PhotoCard';
import { GlobalStyle } from './GlobalStyles';

const App = () => (
  <div>
    <GlobalStyle />
    <ListOfCategories />
    <PhotoCard />
  </div>
);

export default App;
