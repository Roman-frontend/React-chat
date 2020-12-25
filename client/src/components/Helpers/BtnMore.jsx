import React, { useMemo } from 'react';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';
import iconMore from '../../images/icon-more.png';

export const BtnMore = (element = null, clas = null, handler = null) => {
  const topIconActionRelativeTopPage = useMemo(() => {
    if (element) {
      return document.getElementById(element._id).getBoundingClientRect().top;
    }
  }, [element]);

  if (topIconActionRelativeTopPage) {
    return (
      <Tippy content='Actions'>
        <img
          className={clas}
          style={{ top: `${topIconActionRelativeTopPage}px` }}
          src={iconMore}
          onClick={(placeLeft) =>
            handler(topIconActionRelativeTopPage, placeLeft)
          }
        />
      </Tippy>
    );
  }
};
