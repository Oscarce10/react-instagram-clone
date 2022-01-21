import React from 'react';

export default function Error() {
  return (
    <div className="raiz">
      <div className="err404">
        <div>
          <div className="not-found">OOPS!</div>
          <div className="not-found">404 - PAGE NOT FOUND</div>
          <div className="return">
            {' '}
            <a href={'/'}>BACK TO HOME</a>
          </div>
        </div>
      </div>
    </div>
  );
}
