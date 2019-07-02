import React from 'react';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Tooltip from '_components/Tooltip/Tooltip';

import {getOrders} from '_actions';

const ToggleClosedButton = ({getOrders, params: {status_exclude}}) => {
  const param = status_exclude ? '' : 'closed';
  const tooltip = status_exclude ? 'Показать закрытые заказы' : 'Скрыть закрытые заказы';
  return (
    <Tooltip tooltip={tooltip}>
      <Button
        bsStyle='link'
        bsSize='large'
        onClick={() => getOrders({status_exclude: param})}>
        {status_exclude && <Glyphicon glyph='glyphicon glyphicon-eye-close'/>}
        {!status_exclude && <Glyphicon glyph='glyphicon glyphicon-eye-open'/>}
      </Button>
    </Tooltip>
  );
};

export default connect(state => ({params: state.orderListParams}), {getOrders})(ToggleClosedButton);
