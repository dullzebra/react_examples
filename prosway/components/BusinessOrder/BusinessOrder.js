import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';

import s from './BusinessOrder.scss';
import Tabs from '_components/Tabs/Tabs';
import OrdersList from './OrdersList/OrdersList';
import Button from '_uicomponents/Button/Button';
import { fetchUserOrders, loadMoreUserOrders } from '_actions';
import { params } from '_config/config';
import BusinessOrderCalendar from './BusinessOrderCalendar/BusinessOrderCalendar';

export class BusinessOrder extends Component {
  state = {
    activeTab: 0,
    loadingMore: false,
    nextUrl: null,
  };

  componentDidMount() {
    this.props.fetchUserOrders(params.businessOrder)
      .then(data => {
        this.setState({ nextUrl: data.next });
      });
  }

  loadMore = () => {
    const { nextUrl } = this.state;
    const loadMoreParams = qs.parse(nextUrl.split('/?')[1]);

    this.setState({ loadingMore: true });
    this.props.loadMoreUserOrders({ ...params.businessOrder, ...loadMoreParams })
      .then(data => {
        this.setState({ loadingMore: false, nextUrl: data.next });
      });
  };

  onTabClick = (i) => {
    this.setState({ activeTab: i });
  };

  renderOrdersList = () => {
    const { orders } = this.props;
    const { loadingMore, nextUrl } = this.state;

    return (
      <React.Fragment>
        <OrdersList items={orders}/>
        {!!nextUrl && <div className={s.BusinessOrderButtons}>
          {loadingMore
          && <Button
            bg={'transparent'}
            type='button'
          >
            Подождите
          </Button>
          }
          {orders && !loadingMore
          && <Button
            bg={'transparent'}
            onClick={this.loadMore}
            type='button'
          >
            Показать ещё
          </Button>
          }
        </div>}
      </React.Fragment>
    );
  };

  render() {
    const { activeTab } = this.state;

    return (
      <div className={s.BusinessOrder}>
        <h1 className={s.BusinessOrderTitle}>
          Мои заказы
        </h1>
        <div className={s.BusinessOrderMenu}>
          <Tabs
            activeTab={activeTab}
            tabs={[
              { label: 'Заявки' },
              { label: 'Календарь' },
            ]}
            onTabClick={this.onTabClick}
            customCssClass='Tabs_themeTall'
          />
        </div>
        {activeTab === 0 && this.renderOrdersList()}

        {activeTab === 1 && <BusinessOrderCalendar timeStart={9} timeEnd={21}/>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user: { orders } } = state;

  return {
    orders,
  };
};

export default connect(mapStateToProps, { fetchUserOrders, loadMoreUserOrders })(BusinessOrder);
