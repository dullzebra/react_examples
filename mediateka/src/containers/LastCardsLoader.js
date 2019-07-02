import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import withConnect from '_hoc/withConnect.js';
import CardList from '_components/CardList/CardList';
import { qsContentType } from '_utils';
import { lastCardsParam } from '_config/const';
import { selectLast } from '_selectors/cards';

const LastCardsLoader = (props) => {
  const content_type = qsContentType(props.location.search);

  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);

  // when page number changed, load more cards
  useEffect(() => {
    if (page > 1) {
      props.getMoreLastCards({
        ...lastCardsParam,
        page,
        content_type,
      })
        .then(data => setNext(data.next))
        .catch(() => setError(true));
    }
  }, [page]);

  // when content_type filter changed, reguest new cards from page 1
  useEffect(() => {
    props.getLastCards({
      ...lastCardsParam,
      page: 1,
      content_type,
    })
      .then(data => {
        setNext(data.next);
        setPage(1);
      })
      .catch(() => setError(true));
  }, [content_type.length]);

  return (
    error
      ? <>Не удалось загрузить данные</>
      : <>
        {props.list &&
          <CardList
            title='Последние добавленные'
            list={props.list}
          />}
        {next &&
          <span
            className='waves-effect waves-light btn-small purple darken-4'
            onClick={() => setPage(p => p + 1)}
          >
            Показать ещё
          </span>}
      </>
  );
};

const mapStateToProps = state => {
  return {
    list: selectLast(state),
  };
};

export default withRouter(withConnect(
  LastCardsLoader,
  ['getLastCards', 'getMoreLastCards'],
  mapStateToProps,
));
