import React from 'react';
import { PhotoCard } from '../PhotoCard';

export const ListOfPhotoCards = ({ photos = [] }) => (
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
