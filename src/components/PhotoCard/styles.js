import styled from 'styled-components';
import { BsSuitHeartFill } from 'react-icons/all';
import { fadeIn } from '../../styles/animation';

export const ImgWrapper = styled.div`
  border-radius: 10px;
  display: block;
  height: 0;
  overflow: hidden;
  padding: 56.25% 0 0 0;
  position: relative;
  width: 100%;
  margin: 10px 0 10px;
`;

export const Img = styled.img`
  ${fadeIn({ time: '3s' })};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  width: 100%;
`;

export const Button = styled.button`
  padding-top: 8px;
  display: flex;
  align-items: center;

  & svg {
    margin-right: 4px;
  }

  background: none;
  border: none;
`;

export const LoadingPhotoCard = styled.div`
  min-height: 200px;
  background: #fce77d;
  margin-bottom: 20px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Article = styled.article`
  min-height: 200px;
`;

export const LikedIcon = styled(BsSuitHeartFill)`
  ${fadeIn({ time: '250ms', type: 'ease-in' })}
`;
