import React from 'react';
import { withRouter } from 'react-router-dom';
import withConnect from '_hoc/withConnect.js';
import CardList from '_components/CardList/CardList';
import { qsContentType } from '_utils';
import { useFetchList, useFetchItem } from '_hooks/useFetch';
import { categoryCardsParam } from '_config/const';
import { selectCategory } from '_selectors/cards';

const CategoryCardsLoader = (props) => {
  const {
    getByCategoryCards,
    getCategory,
    match: {
      params: { id },
    },
  } = props;

  const content_type = qsContentType(props.location.search);

  const [category] = useFetchItem(
    getCategory,
    id,
    [id],
  );

  const [error] = useFetchList(
    getByCategoryCards,
    { ...categoryCardsParam, category: id, content_type },
    [id, content_type.length],
  );

  return (
    error
      ? <>Не удалось загрузить данные</>
      : <CardList
        title={category.name}
        list={props.list}
      />
  );
};

const mapStateToProps = state => {
  return {
    list: selectCategory(state),
  };
};

export default withRouter(withConnect(
  CategoryCardsLoader,
  ['getByCategoryCards', 'getCategory'],
  mapStateToProps,
));
