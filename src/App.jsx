import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import { ListOfCategories } from './components/ListOfCategories';
import { GlobalStyle } from './styles/GlobalStyles';
import { ListOfPhotoCards } from './components/ListOfPhotoCards';
import Logo from './components/Logo';

function RetrieveData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
    setLoading(true);
    const url = 'https://oscarce10.s3.amazonaws.com/db.json';
    await axios.get(url)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => error);
  }, []);
  return { data, loading };
}

const App = () => {
  const { data, loading } = RetrieveData();

  return (
    <div>
      <GlobalStyle />
      <Logo />
      {
        !loading
          ? <ListOfCategories />
          : <ListOfCategories />
      }
      {
        !loading
          ? <ListOfPhotoCards photos={data.photos} />
          : <BeatLoader />
      }
    </div>
  );
};

export default App;
