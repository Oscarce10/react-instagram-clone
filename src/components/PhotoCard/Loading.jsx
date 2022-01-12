import React from 'react';
import { HashLoader } from 'react-spinners';
import { LoadingPhotoCard } from './styles';

export const Loading = ({color = '#f96167', width = 100, height = 4 }) => (
  <LoadingPhotoCard>
    <HashLoader
      color={color}
      width={width}
      height={height}
    />
  </LoadingPhotoCard>
);
