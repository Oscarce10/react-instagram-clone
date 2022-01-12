import React from 'react';
import { Anchor, Image } from './styles';

const DEFAULT_IMAGE = 'https://picsum.photos/200';

export const Category = ({ cover = DEFAULT_IMAGE, path, emoji = '?' }) => (
  <Anchor href={path}>
    <Image
      src={cover}
      alt="Pending"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = DEFAULT_IMAGE;
      }}
    />
    {emoji}
  </Anchor>
);
