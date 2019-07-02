import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Error from '_components/Alert/ErrorMessage';

// Now we check only 'change' rights by default
const GRANTED = ['change'];

export default (Component, section, granted = GRANTED) => {
  class withPermissions extends React.Component {
    static propTypes = {
      section: PropTypes.string,
      granted: PropTypes.arrayOf(PropTypes.string), //['view', 'change', 'add', 'delete']
      Component: PropTypes.func,
      permissions: PropTypes.shape({
        //view:  PropTypes.arrayOf(PropTypes.string),
        change:  PropTypes.arrayOf(PropTypes.string),
      }),
    }

    render() {
      const {permissions, ...rest} = this.props;

      // If no section specified just pass through permissions to Component
      if (!section) {
        return <Component {...this.props} />;
      }

      // Allow component render if permissions of 'granted' array are set
      const renderAllowed = isPermsGranted(permissions, section, granted);

      if (!renderAllowed) {
        return <Error>У вас нет прав для просмотра этого раздела</Error>;
      }

      return <Component {...rest} />;
    }
  }

  const mapStateToProps = (state = {}) => {
    return {
      permissions: state.ping.user ? state.ping.user.permissions : [],
    };
  };

  return connect(mapStateToProps)(withPermissions);
};


// Check permissions for section
export const isPermsGranted = (permissions, section, granted = GRANTED) => {
  if (!section) {
    return true;
  }

  try {
    return granted.every(str => permissions[str].includes(section));
  } catch (e) {
    console.log(e);
  }
  return false;
};
