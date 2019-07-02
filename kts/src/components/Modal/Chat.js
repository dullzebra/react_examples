import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import OrderComments from '_components/Order/OrderComments/OrderComments';
import UserContact from '_components/User/UserNameContact';
import withModalState from '_hoc/withModalState';

import {
  brandPrimary,
  zindexTooltip,
} from '!!sass-variable-loader!_sassVars';

const Close = styled(Glyphicon)`
  float: right;
  font-size: 15px; 
  margin-top: 3px;
  cursor: pointer;
  color: ${brandPrimary};
  opacity: 0.9;
`;

const ChatModal = ({
  show,
  open,
  close,
  children: trigger,
  orderId,
  number,
  managerId,
}) => {
  const orderNumber = number ? ` по заказу ${number}` : '';
  return (<>
    {trigger(open)}

      <Modal show={show} onHide={close} style={{zIndex: zindexTooltip}}>
        <Modal.Header>
          <Close glyph='glyphicon glyphicon-remove' onClick={close} />
          <Modal.Title>
            <UserContact id={managerId}>
              {name => name}
            </UserContact>
            {orderNumber}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrderComments id={orderId} manager={managerId} />
        </Modal.Body>
      </Modal>
    </>);
};

export default withModalState(ChatModal);

ChatModal.propTypes = {
  children: PropTypes.func.isRequired,
  orderId: PropTypes.number,
  managerId: PropTypes.number,
  number: PropTypes.string,
};
