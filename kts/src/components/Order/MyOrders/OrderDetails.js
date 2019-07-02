import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import differenceWith from 'lodash/differenceWith';
import keys from 'lodash/keys';
import uniq from 'lodash/uniq';
import SmartTable from '_components/SmartTable/SmartTable';

import {selectOrdersById} from '_selectors';
import {getProducts} from '_actions';

const actions = {getProducts};


const Panel = styled.div`
  width: 100%;
  overflow-y: auto;
`;

const tableHead = {
  id: 'id',
  vendor_code: 'Артикул',
  product: 'Наименование',
  product_line: 'Линейка',
  product_type: 'Тип',
  novelty: 'Новинка',
  authors: 'Авторы',
  year: 'Год издания',
  price_group: 'Группа',
  price: 'Стоимость, руб',
  quantity: 'Кол-во',
  quantity_plan: 'План',
  quantity_reserved: 'На складе',
  external_status: 'Статус',
};

const cellStyles = {
  vendor_code: {
    width: '1%',
  },
  product: {
    width: '15%',
  },
  product_line: {
    width: '10%',
  },
  product_type: {
    width: '1%',
  },
  novelty: {
    width: '1%',
  },
  year: {
    width: '1%',
  },
  price: {
    width: '1%',
  },
  price_group: {
    width: '10%',
  },
  quantity: {
    width: '1%',
  },
  external_status: {
    width: '1%',
  },
  authors: {
    width: '10%',
  },
};

const prepareSource = (tableSource, productsById, contractItems) => {
  if (!productsById) return tableSource;

  return tableSource.map(item => {
    const preparedItem = {};

    if (item.product && productsById[item.product]) {
      const product = productsById[item.product];
      for (const key in tableHead) {
        // specific props
        if (key === 'product') {
          preparedItem[key] = product.name;
        } else if (key === 'price') {
          const priceVal = item[key] || contractItems && contractItems[item.product] && contractItems[item.product].price;
          preparedItem[key] = priceVal;
        } else if (key === 'year') {
          preparedItem[key] = {
            value: product.year,
            needFormat: false,
          };
        } else if (key === 'novelty') {
          preparedItem[key] = {
            value: product.novelty,
            needFormat: true,
          };
        // take order item props or product prop
        } else {
          preparedItem[key] = item[key] !== undefined ? item[key] : product[key];
        }
      }
    }

    return preparedItem;
  });
};


class OrderDetails extends React.Component {
  state = {
    tableSource: [],
    id: null,
    number: null,
    loading: false,
    //will store id of loaded products
    cachedProducts: keys(this.props.productsById),
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {cachedProducts, id: prevId, loading} = prevState;
    const {id, ordersById, productsById, contracts, getProducts} = nextProps;
    const order = ordersById[id];
    const contractItems = order && contracts[order.contract].items;

    // id was cleared after order removing
    if (!id && prevId || !order) {
      return {
        id: null,
        number: null,
        tableSource: [],
      };
    }

    // On id changed we fetch products that have not beeen cached.
    if (!loading && id !== prevId) {
      const nextProducts = order.items.map(p => p.product);
      const newProducts = differenceWith(nextProducts, cachedProducts, (a, b) => a == b);

      if (!newProducts.length) {
        // nothing to fetch - store new table data
        return {
          id,
          number: order.number,
          tableSource: prepareSource(order.items, productsById, contractItems),
        };
      }

      // need fetch
      getProducts({id: uniq(newProducts)});
      return {
        loading: true,
      };
    }


    if (!loading && nextProps.deletedPositions.length) {
      return {
        tableSource: prepareSource(order.items, productsById, contractItems),
      };
    }

    const products = keys(productsById);

    // On new products received we cache them and store new table data
    if (products.length !== cachedProducts.length) {
      return {
        loading: false,
        id,
        number: order.number,
        cachedProducts: products,
        tableSource: prepareSource(order.items, productsById, contractItems),
      };
    }
    return null;
  }

  render() {
    //console.log('render details', this.state.tableSource);
    const {editable, onSelectOrderPositions} = this.props;
    const {tableSource, id, number, loading} = this.state;
    const numberStr = !!number && `№ ${number}`;

    let optionalProps = {};

    if (editable) {
      optionalProps = {
        onCheckRows: onSelectOrderPositions,
      };
    }

    return (
      <Panel>
        <h2>Детализация заказа {numberStr}</h2>
        {!id && <div>Выберите заказ в таблице выше</div>}
        {loading && <div>...</div>}
        {!loading && tableSource.length > 0 &&
        <SmartTable
          cellStyles={cellStyles}
          source={tableSource}
          head={tableHead}
          sortable
          id={id}
          {...optionalProps}
          filterColumn='order_details'
        />}
      </Panel>
    );
  }
}

function mapStateToProps(state = {}) {
  return {
    ordersById: selectOrdersById(state),
    productsById: state.productsById,
    contracts: state.contracts,
  };
}

OrderDetails.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  editable: PropTypes.bool,
  onSelectOrderPositions: PropTypes.func,
  deletedPositions: PropTypes.array,
};


export default connect(mapStateToProps, actions)(OrderDetails);
