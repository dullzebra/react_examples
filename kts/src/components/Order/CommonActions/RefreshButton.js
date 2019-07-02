import React from 'react';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Tooltip from '_components/Tooltip/Tooltip';

import {getOrders} from '_actions';

const RefreshButton = ({getOrders}) => (
  <Tooltip tooltip='Обновить список заказов'>
    <Button
      bsStyle='link'
      bsSize='large'
      onClick={() => getOrders()}>
      <Glyphicon glyph='glyphicon glyphicon-refresh'/>
    </Button>
  </Tooltip>
);

export default connect(null, {getOrders})(RefreshButton);
