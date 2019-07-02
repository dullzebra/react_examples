import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';

import Tooltip from '_components/Tooltip/Tooltip';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import {userName} from './UserName';

import {
  brandPrimary,
  fontSizeBase,
  fontSizeSmall,
} from '!!sass-variable-loader!_sassVars';
import {selectUsersById} from '_selectors';

const Sign = styled(Glyphicon)`
  margin-right: 5px;  
  color: ${brandPrimary};
  font-size: ${fontSizeBase};
  opacity: 0.9;
`;

const TooltipSign = styled(Glyphicon)`
  margin-right: 5px;
  font-size: ${fontSizeSmall};
`;

const TooltipText = styled.div`
 font-size: ${fontSizeBase};
 text-align: left; 
`;

const Trigger = styled.span`
  color: ${brandPrimary}; 
`;


// User contact data
const UserNameContact = props => {
  const {id, usersById, children, additional = []} = props;
  const user = usersById[id];

  if (!user) return null;

  const email = user.email
    ?
    <TooltipText>
      <TooltipSign glyph='glyphicon glyphicon-envelope' />{user.email}</TooltipText>
    :
    null
  ;
  const phone = user.phone
    ?
    <TooltipText>
      <TooltipSign glyph='glyphicon glyphicon-earphone' />{user.phone}
    </TooltipText>
    :
    null
 ;

  const other = additional.length
    ? additional.map((obj, i) => <TooltipText key={i}>{obj}</TooltipText>)
    : null;

  if (!email && !phone && !other) {
    return children ? children(userName({id, usersById})) : null;
  }

  const tooltip = <>{other}{email}{phone}</>;
  const name = userName({id, usersById});
  return (<>
    <Tooltip tooltip={tooltip}>
      <span>
        <Sign glyph='glyphicon glyphicon-user' />
        {children && <Trigger>{children(name)}</Trigger>}
      </span>
    </Tooltip>
    </>);
};

const mapStateToProps = (state = {}) => {
  return {
    usersById: selectUsersById(state),
  };
};

export default connect(mapStateToProps)(UserNameContact);


UserNameContact.propTypes = {
  children: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  usersById: PropTypes.object,
};
