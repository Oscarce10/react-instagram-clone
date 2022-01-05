import styled, { keyframes } from 'styled-components';

const fadeInKeyFrames = keyframes`
  from {
    filter: blur(5px);
    opacity: 0;
  }
  to {
    filter: blur(0);
    opacity: 1;
  }
`;

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
  animation: ${fadeInKeyFrames} 1s ease-in-out;
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
  background:none;
  border:none;
`;
