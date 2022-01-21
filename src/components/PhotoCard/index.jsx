import React, { useState } from 'react';
import { BsSuitHeart } from 'react-icons/bs';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useNearScreen } from 'hooks/useNearScreen';
import { Link } from 'react-router-dom';
import {
  Article, Button, Img, ImgWrapper, LikedIcon,
} from './styles';
import { Loading } from './Loading';

export const PhotoCard = ({
  id, likes = 0, src = `https://picsum.photos/400?random=${Math.random()}`,
}) => {
  const [isLiked, setIsLiked] = useLocalStorage(id, false);
  const [show, ref] = useNearScreen();
  const [likesCount, setLikesCount] = useState(likes);
  return (
    <Article ref={ref}>
      {
        show ? (
          <>
            <Link to={`/photos/${id}`}>
              <ImgWrapper>
                <Img src={src} alt="card" loading="lazy" />
              </ImgWrapper>
            </Link>
            <Button onClick={() => {
              setIsLiked(!isLiked);
              setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
            }}
            >
              <span>
                {
                  isLiked
                    ? <LikedIcon color="E6005C" size="32px" />
                    : <BsSuitHeart size="32px" />

                }
              </span>
              {likesCount}
                &nbsp;likes
            </Button>
          </>
        )
          : (
            <Loading />
          )
      }
    </Article>
  );
};
