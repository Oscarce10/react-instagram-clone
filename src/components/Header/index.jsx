import React from 'react';
import { Logo } from '../Logo';
import { Octocat } from '../Logo/styles';
import { HeaderStyle } from './styles';
import { GlobalStyle } from '../../styles/GlobalStyles';

export const Header = () => (
  <HeaderStyle>
    <GlobalStyle />
    <Logo />
    <Octocat />
  </HeaderStyle>
);
