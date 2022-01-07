import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { ListOfCategories } from './components/ListOfCategories';
import { GlobalStyle } from './styles/GlobalStyles';
import { ListOfPhotoCards } from './components/ListOfPhotoCards';
import Logo from './components/Logo';
import { GopherSvg } from './components/Logo/Gopher';

const App = () => {
  const [data, setData] = useState(null);
  useEffect(async () => {
    const url = 'https://oscarce10.s3.amazonaws.com/db.json';
    await fetch(url, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
      },
    }).then((res) => res.json())
      .then((response) => setData(response))
      .catch((error) => error);
  }, []);

  return (
    <div>
      <GlobalStyle />
      <Logo />
      <GopherSvg />
      {
        data
          ? <ListOfCategories initCategories={data.categories} />
          : <BeatLoader />
      }
      {
        data
          ? <ListOfPhotoCards photos={data.photos} />
          : <BeatLoader />
      }
    </div>
  );
};

export default App;
