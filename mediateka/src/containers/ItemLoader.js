import React from 'react';
import { withRouter } from 'react-router-dom';
import withConnect from '_hoc/withConnect.js';
import Item from '_components/Item/Item';
import { useFetchItem } from '_hooks/useFetch';
import { selectCurrent } from '_selectors/item';

const ItemLoader = props => {
  const {
    match: {
      params: { itemType, id },
    },
    getItem,
  } = props;

  const [error] = useFetchItem(
    getItem,
    { id, type: itemType },
    [id, itemType],
  );

  return (
    error
      ? <>Не удалось загрузить данные</>
      : <Item item={props.item} />
  );
};

const mapStateToProps = state => {
  return {
    item: selectCurrent(state),
  };
};

export default withRouter(withConnect(ItemLoader, ['getItem'], mapStateToProps));
