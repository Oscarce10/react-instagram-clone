import React from 'react';
import { MdHome, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { Link, Nav } from './styles';

const SIZE = '32px';
export const NavBar = () => (
  <Nav>
    <Link to="/">
      <MdHome size={SIZE} />
    </Link>
    <Link to="likes"><MdFavoriteBorder size={SIZE} /></Link>
    <Link to="user"><AiOutlineUser size={SIZE} /></Link>
  </Nav>
);
