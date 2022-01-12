import React from 'react';
import { CircleLoader } from 'react-spinners';
import { LoadingStyle } from './styles';

export const Loading = () => (
  <LoadingStyle>
    {
      [1, 2, 3, 4, 5, 6].map(() => (
        <CircleLoader
          key={Math.random()}
          sizeUnit="px"
          size={60}
          color="#00BFFF"
        />
      ))
    }
  </LoadingStyle>
);
