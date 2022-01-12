import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PhotoCard } from '../PhotoCard';

export const ListOfPhotoCards = () => {
  const [photos, setPhotos] = useState([]);
  useEffect(async () => {
    const uri = 'https://oscarce10-photogram.herokuapp.com/api/v1/photos?items_per_page=21';
    await axios.get(uri).then((response) => {
      setPhotos(response.data.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);
  return (
    <ul>
      {photos.map((photo) => (
        <li key={photo.id}>
          <PhotoCard
            id={photo.id}
            src={photo.src}
            likes={photo.likes}
          />
        </li>
      ))}
    </ul>
  );
};
