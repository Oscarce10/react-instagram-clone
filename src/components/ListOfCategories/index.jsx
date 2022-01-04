import React from 'react';
import { categories } from 'api/db.json';
import { Category } from '../Category';
import { List, Item } from './styles';

export const ListOfCategories = () => (
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
