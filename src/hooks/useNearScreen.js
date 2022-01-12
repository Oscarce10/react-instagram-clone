import { useEffect, useRef, useState } from 'react';

export const useNearScreen = () => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ((entries) => {
        const { isIntersecting } = entries[0];
        if (isIntersecting) {
          setTimeout(() => {
            setShow(true);
          }, 1000);
          // para evitar que el observer se ejecute mas de una vez
          observer.disconnect();
        }
      }),
    );
    observer.observe(ref.current);
  }, [show, ref]);
  return [show, ref];
};
