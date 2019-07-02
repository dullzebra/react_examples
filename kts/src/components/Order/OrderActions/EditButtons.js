import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import Confirm from '_components/Modal/Confirm';
import MessageModal from '_components/Modal/Message';
import ErrorMessage from '_components/Alert/ErrorMessage';

import {path} from '_config/url';
import {declineDesimalNoun} from '_utils';
import { deleteOrder, patchOrder, getOrders } from '_actions';
const actions = {deleteOrder, patchOrder, getOrders};
import { selectOrdersById } from '_selectors';

const Sign = styled(Glyphicon)`
  margin-right: 5px;
`;

const SubmitError = styled.div`
  position: absolute;
  left: 8px;
  bottom: 40px;
  z-index: 1; 
  opacity: 0.9;
`;

class EditButtons extends React.Component {
  state = {
    isMessageOpen: false,
    submitError: null,
  }

  closeMessage = () => this.setState({isMessageOpen: false})

  closeSubmitError = () => this.setState({submitError: null})

  handleDeleteOrder = async () => {
    const {id, deleteOrder, getOrders, onUpdateOrder} = this.props;

    this.setState({ submitError: null });

    await deleteOrder(id)
      .then(() => onUpdateOrder(null))
      .catch(() => this.setState({ submitError: 'При удалении заказа произошла ошибка' }));
    await getOrders()
      .catch(() => this.setState({ submitError: 'Не удалось обновить список заказов, используйте кнопку "Обновить"' }));
  }

  handleEditOrder = () => {
    const {history, id} = this.props;
    history.push(`${path.orderEdit}${id}`);
  }

  handleApproveOrder = async () => {
    const {id, patchOrder, getOrders, onUpdateOrder} = this.props;

    this.setState({ submitError: null });
    await patchOrder(id, {status: 'approved'})
      .then(() => onUpdateOrder(null))
      .catch(() => this.setState({ submitError: 'При отправке заказа произошла ошибка' }));
    await getOrders()
      .catch(() => this.setState({ submitError: 'Не удалось обновить список заказов, используйте кнопку "Обновить"' }));
  }

  callAllowed = callBack => {
    const {id, ordersById, selectedPositions} = this.props;
    const order = ordersById[id];

    // If all items of order are selected callback is not allowed
    if (order.items.length === selectedPositions.length) {
      return this.setState({isMessageOpen: true});
    }
    callBack?.call();
  }

  prepareDeletePositions = () => {
    const {id, ordersById, selectedPositions} = this.props;
    const order = ordersById[id];
    order.items = order.items.filter(p => !selectedPositions.includes(p.id));
    return [id, order];
  }

  splitOrder = () => {
    const {history, id, selectedPositions, ordersById} = this.props;

    if (!ordersById[id]) {
      throw new Error(`Нет данных по заказу id=${id}`);
    }

    const items = ordersById[id].items.filter(p => {
      if (selectedPositions.includes(p.id)) {
        const newPosition = {...p};
        newPosition.id = null;
        return newPosition;
      }
    });

    history.push({
      pathname: path.orderNew,
      state:{
        contract:  ordersById[id].contract,
        items,
        deletePositions: this.prepareDeletePositions(),
      },
    });
  }

  render() {
    const {id, editable, selectedPositions, ordersById} = this.props;
    const {submitError} = this.state;
    const priceGroups = ordersById[id]?.price_groups;
    let priceGroupsConfirm = '';

    if (priceGroups?.length > 1) {
      priceGroupsConfirm = `Заказ будет разделен на ${priceGroups.length}\
        ${declineDesimalNoun(priceGroups.length, ['часть', 'части', 'частей'])}\
        (${priceGroups.join(', ')})`;
    }

    return (<>
      {submitError && <SubmitError>
        <ErrorMessage onDismiss={this.closeSubmitError}>{submitError}</ErrorMessage>
      </SubmitError>}

      <Button
        bsStyle='primary'
        disabled={!id || !editable || !selectedPositions.length}
        onClick={this.callAllowed.bind(null, this.splitOrder)}
      >Перенести в новый заказ</Button>

      <Button
        onClick={this.handleEditOrder}
        disabled={!id || !editable}
        bsStyle='primary'
      ><Sign glyph='glyphicon glyphicon-pencil' />Редактировать заказ</Button>

       <Confirm
         title='Вы действительно хотите удалить выбранный заказ?'
         bsStyle='danger'
         confirm={this.handleDeleteOrder}
         cancel={null}
       >
         { showConfirm =>
           <Button
             onClick={showConfirm}
             disabled={!id || !editable}
             bsStyle='danger'
           ><Sign glyph='glyphicon glyphicon-remove' />Удалить заказ</Button>
         }
       </Confirm>

      <Confirm
        title='Отправить заказа на обработку менеджеру?'
        body={[
          'После отправки заказ может редактироваться только менеджером издательства',
          `${priceGroupsConfirm}`,
        ]}
        bsStyle='success'
        confirm={this.handleApproveOrder}
        cancel={null}
      >
        { showConfirm =>
          <Button
            onClick={showConfirm}
            disabled={!id || !editable}
            bsStyle='success'
          ><Sign glyph='glyphicon glyphicon-ok' />Отправить заказ</Button>
        }
      </Confirm>

      <MessageModal
        show={this.state.isMessageOpen}
        close={this.closeMessage}
        title='Вы не можете перенести все строки заказа' />
    </>);
  }
}


const mapStateToProps = (state = {}) => {
  return {
    ordersById: selectOrdersById(state),
  };
};

export default withRouter(connect(mapStateToProps, actions)(EditButtons));


EditButtons.propTypes = {
  id: PropTypes.number,
  editable: PropTypes.bool,
  selectedPositions: PropTypes.array,
  onDeletePositions: PropTypes.func,
  onUpdateOrder: PropTypes.func,
};
