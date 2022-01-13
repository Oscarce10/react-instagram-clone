import React, { useEffect } from 'react';
import { ListOfCategories } from './components/ListOfCategories';
import { GlobalStyle } from './styles/GlobalStyles';
import { ListOfPhotoCards } from './components/ListOfPhotoCards';
import { PhotoCardWithQuery } from './components/PhotoCardWithQuery';
import { Header } from './components/Header/Header';

const App = () => {
  useEffect(() => {
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
  });
  const urlParams = new URLSearchParams(window.location.search);
  const detailId = urlParams.get('detail');
  return (
    <div>
      <GlobalStyle />
      <Header />
      {
        detailId
          ? (
            <>
              <h1>
                {`Detail photo ${detailId}`}
              </h1>
              <PhotoCardWithQuery
                id={detailId}
              />
            </>
          )
          : (
            <>
              <ListOfCategories />
              <ListOfPhotoCards />
            </>
          )
      }
    </div>
  );
};

export default App;
