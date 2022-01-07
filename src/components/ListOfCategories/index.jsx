import React, { Fragment, useEffect, useState } from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';

export const ListOfCategories = ({ initCategories = [] }) => {
  const [categories] = useState(initCategories);
  const [showFixed, setShowFixed] = useState(false);
  const renderList = (fixed) => (
    <List className={fixed ? 'fixed' : ''}>
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

  useEffect(() => {
    const onScroll = () => {
      const newShowFixed = window.scrollY > 235;
      setShowFixed(newShowFixed);
    };
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, [showFixed]);

  return (
    <>
      {renderList()}
      {showFixed && renderList(true)}
    </>
  );
};
