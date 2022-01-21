import React from 'react';
import {
  Route,
  Routes,
} from 'react-router-dom';
import App from '../App';
import { PhotoCardWithQuery } from '../components/PhotoCardWithQuery';
import { ListOfPhotoCards } from '../components/ListOfPhotoCards';
import Error from '../pages/Error';

export const Router = () => (
  <Routes>
    <Route exact path="/" element={<App />}>
      <Route index element={<ListOfPhotoCards />} />
      <Route path="category/:categoryId" element={<ListOfPhotoCards />} />
      <Route path="photos/:detailId" element={<PhotoCardWithQuery />} />
      <Route path="*" element={<Error />} />
    </Route>
  </Routes>
);
