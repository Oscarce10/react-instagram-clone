import React, { useEffect } from 'react';
import { ListOfCategories } from './components/ListOfCategories';
import { GlobalStyle } from './styles/GlobalStyles';
import { ListOfPhotoCards } from './components/ListOfPhotoCards';
import { Logo } from './components/Logo';
import { PhotoCardWithQuery } from './components/PhotoCardWithQuery';

const App = () => {
  useEffect(() => {
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
  });
  const urlParams = new URLSearchParams(window.location.search);
  const detailId = urlParams.get('detail');
  console.log(detailId);
  return (
    <div>
      <GlobalStyle />
      <Logo />
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
