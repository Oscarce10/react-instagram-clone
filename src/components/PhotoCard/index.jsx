import React from 'react';
import { ImgWrapper } from './styles';

const DEFAULT_IMAGE = 'https://picsum.photos/500';

export const PhotoCard = ({
  id, likes = 0, src = DEFAULT_IMAGE
}) => (
  <ImgWrapper>
    <a href={`detail/${id}`}>
      <div>
        <img src={src} alt="card" />
      </div>
    </a>
    <button type="button">
      <span>&hearts;</span>
      {likes}
    </button>
  </ImgWrapper>
);
