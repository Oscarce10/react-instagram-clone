import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PhotoCard } from '../PhotoCard';

export const PhotoCardWithQuery = ({ id }) => {
  const [photo, setPhoto] = useState(null);
  useEffect(async () => {
    const uri = `https://oscarce10-photogram.herokuapp.com/api/v1/photos/${id}`;
    await axios.get(uri).then((response) => {
      setPhoto(response.data.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);
  return (
    photo && (
      <PhotoCard
        id={photo.id}
        src={photo.src}
        likes={photo.likes}
      />
    )
  );
};
