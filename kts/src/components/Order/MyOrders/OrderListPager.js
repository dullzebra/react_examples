import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Pager from '_components/Pager/Pager';
import {getOrders} from '_actions';


class OrderListPager extends React.Component {
 onClick = current => {
   const {getOrders, params: {ordering, page_size}} = this.props;
   getOrders({page: current, page_size, ordering});
 }

 render() {
   const {params: {total, page, page_size}} = this.props;
   const pageTotal = Math.ceil(total / page_size);

   if (isNaN(pageTotal) || pageTotal <= 1) return null;

   return (
     <Pager
       current={page}
       pageTotal={pageTotal}
       onClick={this.onClick}
     />);
 }
}

export default connect(state => ({params: state.orderListParams}), {getOrders})(OrderListPager);
