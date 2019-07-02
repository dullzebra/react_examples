import React from 'react';
import withConnect from '_containers/withConnect';

const Favorite = ({ isFavorite, contentId, postFavorite, delFavorite }) => {
  const toggle = () => {
    try {
      if (isFavorite) {
        delFavorite(contentId);
      } else {
        postFavorite(contentId);
      }
    } catch (e) {
      //console.log('favorite error');
    }
  };

  return (
    <div
      className={'fav fav-btn' + (isFavorite ? ' active' : '')}
      onClick={toggle}
    >
      <i className='material-icons tiny'>
        <span className='full' title='В избранном'>favorite</span>
        <span className='empty' title='Добавить в избранное'>favorite_border</span>
      </i>
    </div>
  );
};

export default withConnect(Favorite, ['postFavorite', 'delFavorite']);
