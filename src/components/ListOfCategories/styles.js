import styled, { css } from 'styled-components';
import { fadeIn } from '../../styles/animation';

export const List = styled.ul`
  display: flex;
  overflow: scroll;
  width: 100%;
  ${(props) => props.fixed && css`{
    ${fadeIn()}
    background: transparent;
    border-radius: 60px;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    left: 0;
    margin: 0 auto;
    max-width: 600px;
    padding: 5px;
    position: fixed;
    right: 0;
    top: 43px;
    transform: scale(.5);
    z-index: 1;
  }`}
  `;

export const Item = styled.li`
  padding: 0 8px;
`;

export const LoadingStyle = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: start;
  height: 100%;
  min-width: 600px;
  min-height: 100px;
`;
