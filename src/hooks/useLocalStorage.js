import { useState } from 'react';
import axios from 'axios';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.error(e);
      return initialValue;
    }
  });
  const setLocalStorage = (value) => {
    try {
      setValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
      const uri = 'https://oscarce10-photogram.herokuapp.com/api/v1/photos';
      const params = {
        photo_id: key,
        action: value === true ? 'like' : 'dislike',
      };
      axios.post(uri, params).then(
        (response) => response.data,
      ).catch((error) => {
        console.error(error);
        console.error(error.response);
        console.error(error.response.data);
        console.error(error.response.data.error);
      });
    } catch (e) {
      console.error(e);
    }
  };
  return [storedValue, setLocalStorage];
};
