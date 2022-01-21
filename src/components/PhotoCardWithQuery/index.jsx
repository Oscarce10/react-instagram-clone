import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PhotoCard } from '../PhotoCard';

export const PhotoCardWithQuery = () => {
  const id = useParams().detailId;
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
      <>
        <h1>
          {`Detail photo ${id}`}
        </h1>
        <PhotoCard
          id={photo.id}
          src={photo.src}
          likes={photo.likes}
        />
      </>
    )
  );
};
