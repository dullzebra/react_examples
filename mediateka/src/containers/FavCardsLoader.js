import React from 'react';
import { withRouter } from 'react-router-dom';
import withConnect from '_hoc/withConnect.js';
import CardList from '_components/CardList/CardList';
import { useFetchList } from '_hooks/useFetch';
import { qsContentType } from '_utils';
import { favCardsParam } from '_config/const';
import { selectFavorites } from '_selectors/cards';

const FavCardsLoader = props => {
  const content_type = qsContentType(props.location.search);

  const [error] = useFetchList(
    props.getFavoriteCards,
    { ...favCardsParam, content_type },
    [content_type.length],
  );

  return (
    error
      ? <>Не удалось загрузить данные</>
      : <CardList
        title={'Избранное'}
        list={props.list}
      />
  );
};

const mapStateToProps = state => {
  return {
    list: selectFavorites(state),
  };
};

export default withRouter(withConnect(
  FavCardsLoader,
  ['getFavoriteCards'],
  mapStateToProps
));
