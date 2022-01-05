import React from 'react';
import { BsSuitHeartFill } from 'react-icons/bs';
import { Button, Img, ImgWrapper } from './styles';

export const PhotoCard = ({
  id, likes = 0, src = `https://picsum.photos/400?random=${Math.random()}`,
}) => (
  <article>
    <a href={`detail/${id}`}>
      <ImgWrapper>
        <Img src={src} alt="card" />
      </ImgWrapper>
    </a>
    <Button>
      <span><BsSuitHeartFill size="32px" color="#E6005C" /></span>
      {likes}
      &nbsp;likes
    </Button>
  </article>
);
