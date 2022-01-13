import React from 'react';
import { Logo } from '../Logo';
import { Octocat } from '../Logo/styles';
import { HeaderStyle } from './styles';

export const Header = () => (
  <HeaderStyle>
    <Logo />
    <Octocat />
  </HeaderStyle>
);
