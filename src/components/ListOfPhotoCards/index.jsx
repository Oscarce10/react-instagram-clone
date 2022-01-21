import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PhotoCard } from '../PhotoCard';
import { ListOfCategories } from '../ListOfCategories';

export const ListOfPhotoCards = () => {
  const [photos, setPhotos] = useState([]);
  const { categoryId } = useParams();
  useEffect(async () => {
    setPhotos([]);
    let uri = 'https://oscarce10-photogram.herokuapp.com/api/v1/photos?items_per_page=21';
    if (categoryId) {
      uri += `&category_id=${categoryId}`;
    }
    await axios.get(uri).then((response) => {
      setPhotos(response.data.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [categoryId]);
  return (
    <>
      <ListOfCategories />
      {
        photos
          ? (
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
          )
          : <p>Loading...</p>
      }
    </>
  );
};
