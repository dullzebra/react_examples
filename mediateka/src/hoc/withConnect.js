import React from 'react';
import { connect } from 'react-redux';

import * as actions from '_actions';

/*
* Returns component enhanced with specified actions and mapStateToProps function
*/
export default (Component, actionsNames = [], mapStateToProps = null) => {
  const componentActions = {};
  actionsNames.forEach(name => componentActions[name] = actions[name]);

  class withConnect extends React.Component {
    render() {
      return <Component {...this.props} />;
    }
  }
  return connect(mapStateToProps, componentActions)(withConnect);
};
