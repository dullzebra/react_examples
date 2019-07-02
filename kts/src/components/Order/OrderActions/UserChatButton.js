import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Chat from '_components/Modal/Chat';
import UserName from '_components/User/UserName';

import {
  fontSizeSmall,
  brandPrimary,
} from '!!sass-variable-loader!_sassVars';

const Sign = styled(Glyphicon)`
  margin-right: 5px;
  font-size: ${fontSizeSmall}; 
`;

const Button = styled.span`
  cursor: pointer;
  color: ${brandPrimary};
`;

const ChatButton = React.memo(({onClick, managerId }) => {
  if (!managerId) return;

  return (
    <Button onClick={onClick}>
      <UserName id={managerId}>
        {name => (<>
          <Sign glyph='glyphicon glyphicon-send' />{name}
        </>)}
      </UserName>
    </Button>
  );
});

const UserChatButton = ({orderId, number, managerId}) => (<>
  <Chat
    orderId={orderId}
    number={number}
    managerId={managerId}
  >
    { showModal =>
      <ChatButton
        onClick={showModal}
        managerId={managerId}
      />}
  </Chat>
</>);

export default UserChatButton;

UserChatButton.propTypes = {
  orderId: PropTypes.number,
  number: PropTypes.string,
  managerId: PropTypes.number,
};
