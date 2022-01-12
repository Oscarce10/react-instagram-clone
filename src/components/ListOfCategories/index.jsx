import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Category } from '../Category';
import { List, Item } from './styles';
import { Loading } from './Loading';

export const ListOfCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showFixed, setShowFixed] = useState(false);

  const renderList = (fixed) => (
    <List fixed={fixed}>
      {
        categories.length === 0 ? (
          <Loading />
        )
          : categories.map(
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

  useEffect(async () => {
    const url = 'https://oscarce10-photogram.herokuapp.com/api/v1/categories';
    await axios.get(url)
      .then((response) => {
        setTimeout(() => {
          const res = response.data.data;
          setCategories(res);
          renderList();
        }, 1500);
      })
      .catch((error) => error);
  }, []);

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
