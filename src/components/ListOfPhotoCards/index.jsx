import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PhotoCard } from '../PhotoCard';

export const ListOfPhotoCards = ({categoryId}) => {
  const [photos, setPhotos] = useState([]);
  useEffect(async () => {
    let uri = 'https://oscarce10-photogram.herokuapp.com/api/v1/photos?items_per_page=21';
    if (categoryId) {
      uri += `&category_id=${categoryId}`;
    }
    console.log(uri);
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
