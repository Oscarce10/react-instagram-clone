import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Anchor = styled(Link)`
  display: flex;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
  width: 75px;
`;

export const Image = styled.img`
  border: 1px solid #ddd;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
  width: 75px;
  height: 75px;
  `;
