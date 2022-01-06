import React, { useEffect, useState } from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';

export const ListOfCategories = ({ initCategories = [] }) => {
  const [categories, setCategories] = useState(initCategories);
  return (
    <List>
      {
        categories.map(
          (category) => (
            <Item key={category.id}>
              <Category
                cover={category.cover}
                emoji={category.emoji}
                path={category.path}
              />
            </Item>
          ),
        )
      }
    </List>
  );
};
