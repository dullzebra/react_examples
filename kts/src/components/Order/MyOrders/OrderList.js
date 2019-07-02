import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SmartTable from '_components/SmartTable/SmartTable';
import ErrorMessage from '_components/Alert/ErrorMessage';
import UserChatButton from '_components/Order/OrderActions/UserChatButton';
import Loader from '_components/Loader/Loader';
import OrderListPager from './OrderListPager';

import {getOrders, getContracts, getUsers} from '_actions';
const actions = {getOrders, getContracts, getUsers};
import {selectOrdersById} from '_selectors';

class OrderList extends React.Component {
  state = {
    tableSource: [],
    selectedOrder: null,
    error: null,
    isLoading: true,
    updated: null,
  }

  tableHead = {
    id: {name:'id'},
    contract: {name:'Договор', sort: 'contract__number'},
    number: {name:'Номер заказа', sort: 'number'},
    status: {name:'Статуc заказа', sort: 'status_name'},
    created: {name:'Дата заказа', sort: 'created'},
    managers: {name:'Менеджер'},
    price_groups: {name:'Группы'},
    cost: {name:'Стоимость, руб.'},
    comment: {name: 'Комментарий'},
  }

  orderStatus = {
    new: 'Новый',
    approved: 'Подтвержден',
    sent: 'Отправлен',
    inactive: 'Неактивный',
    closed: 'Закрыт',
  }

  cellStyles = {
    contract: {
      width: '2%',
    },
    number: {
      width: '1%',
    },
    status: {
      width: '1%',
    },
    created: {
      width: '1%',
    },
    managers: {
      width: '10%',
    },
    price_groups: {
      width: '10%',
    },
    cost: {
      width: '1%',
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.tableSource.length !== nextProps.orders.length
      ||
      prevState.updated !== nextProps.updated) {
      return {
        tableSource: nextProps.orders,
      };
    }
    return null;
  }

  componentDidMount() {
    const { getOrders, getContracts, getUsers} = this.props;
    Promise.all([getUsers(), getOrders(), getContracts()])
      .then(() => {
        this.setState({
          isLoading: false,
        });
      })
      .catch(res => {
        let error = 'Не удалось получить список заказов';

        if (res.status === 403) {
          error = 'У вас нет прав для просмотра заказов';
        }

        this.setState( {isLoading: false, error});
      });
  }

  prepareSource = (orders) => {
    return orders.map(item => {
      const preparedItem = {};
      for (const key in this.tableHead) {
        if (key === 'contract') {
          preparedItem[key] = this.displayContractInTable(item[key]);
        } else if (key === 'managers') {
          preparedItem[key] = this.displayManagerInTable(item.id, item.number, item.managers);
        } else if (key === 'status') {
          preparedItem[key] = this.displayStatusInTable(item[key], item.external_status);
        } else if (key === 'cost') {
          preparedItem[key] = this.displayCostInTable(item.contract, item.items);
        } else if (key === 'created') {
          preparedItem[key] = this.displayDateInTable(item[key]);
        } else if (key === 'price_groups') {
          preparedItem[key] = this.displayGroupInTable(item[key]);
        } else {
          preparedItem[key] = item[key];
        }
      }
      return preparedItem;
    });
  }

  displayManagerInTable = (orderId, number, managers) => {
    return
    <UserChatButton
      orderId={orderId}
      number={number}
      managerId={this.selectManager(managers)}
    />;
  }

  displayContractInTable = id => this.props.contracts[id]?.number;

  displayStatusInTable = (code, reserve) => reserve || this.orderStatus[code];

  displayCostInTable = (contractId, items) => {
    const {contracts} = this.props;

    try {
      const contractItems = contracts[contractId].items;

      const cost = items.reduce((acc, cur) => {
        const productId = cur.product;
        const price = contractItems[productId]?.price || 0;
        return acc + cur.quantity * price;
      }, 0);
      return cost;
    } catch (e) {
      //
    }
  }

  displayDateInTable = date => {
    if (date) {
      return {
        value: new Date(date),
        needFormat: true,
      };
    }
    return null;
  }

  displayGroupInTable = arr => {
    if (arr && arr.length) {
      const list = arr.join(', ');
      const total = arr.length > 1 ? `(${arr.length}) ` : '';
      return `${total}${list}`;
    }
    return null;
  }

  selectManager = managers => {
    // find manager with role = 'main' or find first one in list
    if (!managers.length) return null;
    const mainManager = managers.filter(m => m.role === 'main');

    if (mainManager.length) {
      return mainManager[0].user;
    } else {
      return managers[0].user;
    }
  }

  handleSelectRow = id => {
    const {ordersById, onSelectOrder} = this.props;

    if (!onSelectOrder) return;

    const editable = ordersById[id].status === 'new' || ordersById[id].status === 'inactive';
    const managerId = this.selectManager(ordersById[id].managers);
    const number = ordersById[id].number;
    onSelectOrder(id, editable, managerId, number);
  };

  customSort = sortBy => {
    const {getOrders, orderListParams: {ordering}} = this.props;
    let newSortBy;

    if (sortBy) {
      // sorting column changed
      newSortBy = sortBy;
    } else {
      // the same sorting column: just toggle '-' sign of sortBy
      // (sorting request looks like ?ordering=sortBy or ?ordering=-sortBy)
      newSortBy = ordering?.replace?.(/^-?(\w*)/, (match, p) => match === p ? `-${p}` : p) || '';
    }

    getOrders({ordering: newSortBy});
  }

  render() {
    const {tableSource, error, isLoading} = this.state;
    const {orderListParams: {ordering, updated}} = this.props;

    if (error) {
      return <div><ErrorMessage>{error}</ErrorMessage></div>;
    }

    if (!tableSource.length && !isLoading) {
      return <div>Список заказов пуст. Вы можете добавить новый заказ.</div>;
    }

    if (isLoading) {
      return <Loader label='Загрузка заказов' />;
    }

    return (<>
      <SmartTable
        id={updated}
        cellStyles={this.cellStyles}
        source={this.prepareSource(tableSource)}
        head={this.tableHead}
        sortable
        sortingFn={this.customSort}
        onSelectRow={this.handleSelectRow}
        sortBy={ordering}
      />
      <OrderListPager />
    </>);
  }
}

function mapStateToProps(state = {}) {
  const {
    orders,
    contracts,
    orderListParams,
  } = state;

  return {
    orders,
    contracts,
    ordersById: selectOrdersById(state),
    orderListParams,
  };
}

OrderList.propTypes = {
  onSelectOrder: PropTypes.func,
  updated: PropTypes.number,
};

export default connect(mapStateToProps, actions)(OrderList);
