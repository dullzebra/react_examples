import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import withConnect from '_hoc/withConnect.js';
import CardList from '_components/CardList/CardList';
import { qsContentType } from '_utils';
import { recommendCardsParam } from '_config/const';
import { selectRecommend } from '_selectors/cards';

const RecommendCardsLoader = props => {
  const content_type = qsContentType(props.location.search);

  const [error, setError] = useState(false);

  useEffect(() => {
    props.getRecommendCards({ ...recommendCardsParam, content_type })
      .catch(() => setError(true));
  }, [content_type.length]);

  return (
    error
      ? <>Не удалось загрузить данные</>
      : <CardList
        title={'Рекомендуем посмотреть'}
        list={props.list}
        oneRow
      />
  );
};

const mapStateToProps = state => {
  return {
    list: selectRecommend(state),
  };
};


export default withRouter(withConnect(
  RecommendCardsLoader,
  ['getRecommendCards'],
  mapStateToProps
));
