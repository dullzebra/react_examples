import React from 'react';
import styled from 'styled-components';
import Splitter from '_components/Splitter/Splitter';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import OrderActions from '_components/Order/OrderActions/OrderActions';
import CommonActions from '_components/Order/CommonActions/CommonActions';

const HeaderLine = styled.div`  
  transform: translateY(-36px);
  margin-bottom: -36px;
  display: flex;
  justify-content: flex-end;
`;

const splitPanProps = {
  split: 'horizontal',
  primary: 'first',
  defaultSize: '50%',
};

class Order extends React.Component {
  state = {
    selectedOrder: null,
    selectedOrderNumber: '',
    selectedManager: null,
    selectedPositions: [],
    deletedPositions: [],
  }

  handleSelectOrder = (id, editableOrder, managerId, number) => {
    this.setState({
      selectedOrder: id,
      selectedOrderNumber: number,
      selectedManager: managerId,
      editableOrder,
      selectedPositions: [],
      deletedPositions: [],
    });
  }

  handleSelectPositions = arr => {
    this.setState({selectedPositions: arr});
  }

  handleDeletePositions = arr => {
    this.setState({
      selectedPositions: [],
      deletedPositions: arr,
    });
  }

  handleUpdateOrder = id => {
    this.setState({
      selectedOrder: id,
    });
  }

  render() {
    const {
      selectedOrder,
      selectedOrderNumber,
      selectedManager,
      editableOrder,
      selectedPositions,
      deletedPositions,
    } = this.state;

    return (
      <>
      <HeaderLine>
        <CommonActions />
      </HeaderLine>
      <Splitter
        splitPanProps={splitPanProps}>
        <OrderList
          onSelectOrder={this.handleSelectOrder}
        />
        <OrderDetails
          id={selectedOrder}
          onSelectOrderPositions={this.handleSelectPositions}
          deletedPositions={deletedPositions}
          editable={editableOrder}
        />
      </Splitter>
      <OrderActions
        id={selectedOrder}
        number={selectedOrderNumber}
        managerId={selectedManager}
        editable={editableOrder}
        onUpdateOrder={this.handleUpdateOrder}
        onDeletePositions={this.handleDeletePositions}
        selectedPositions={selectedPositions}
      />
      </>
    );
  }
}

export default Order;
