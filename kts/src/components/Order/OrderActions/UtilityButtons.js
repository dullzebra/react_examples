import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Chat from '_components/Modal/Chat';
import MessageModal from '_components/Modal/Message';

const Sign = styled(Glyphicon)`
  margin-right: 5px;
`;

const ChatButton = React.memo(({onClick, disabled}) => (
  <Button
    bsStyle='primary' className='pull-right'
    onClick={onClick}
    disabled={disabled}
  >
    <Sign glyph='glyphicon glyphicon-send' />Переписка
  </Button>
));

const UtilityButtons = ({orderId, number, managerId}) => {
  if (managerId) {
    return (
      <Chat
        orderId={orderId}
        number={number}
        managerId={managerId}
      >
        { showModal =>
          <ChatButton
            onClick={showModal}
            disabled={!orderId}
          /> }
      </Chat>);
  }

  return (
    <MessageModal
      title='Данному заказу не назначен менеджер'
    >
      { showModal =>
        <ChatButton
          onClick={showModal}
          disabled={!orderId}
        /> }
    </MessageModal>);
};


export default UtilityButtons;

UtilityButtons.propTypes = {
  id: PropTypes.number,
  number: PropTypes.string,
  managerId: PropTypes.number,
};
