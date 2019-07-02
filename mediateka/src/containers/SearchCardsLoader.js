import React from 'react';
import { withRouter } from 'react-router-dom';
import withConnect from '_hoc/withConnect.js';
import CardList from '_components/CardList/CardList';
import { useFetchList } from '_hooks/useFetch';
import qs from 'qs';
import { selectSearch } from '_selectors/cards';

const SearchCardsLoader = props => {
  const search = qs.parse(props.location.search.replace('?', ''));

  const [error] = useFetchList(
    props.getSearchCards,
    { ...search },
    [...Object.values(search)],
  );

  let title = 'Найдено';

  if (search.tag) {
    title += ` по тэгу &laquo;${search.tag}&raquo;`;
  }

  return (
    error
      ? <>Не удалось загрузить данные</>
      : <>
        {props.list.length === 0 && <p>Ничего не найдено</p>}
        {props.list.length > 0 &&
          <CardList
            title={title}
            list={props.list}
          />}
      </>

  );
};

const mapStateToProps = state => {
  return {
    list: selectSearch(state),
  };
};


export default withRouter(withConnect(
  SearchCardsLoader,
  ['getSearchCards'],
  mapStateToProps,
));
