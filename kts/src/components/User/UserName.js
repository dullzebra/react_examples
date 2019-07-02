import {connect} from 'react-redux';
import {selectUsersById} from '_selectors';

// User name
export const userName = ({id, usersById, children}) => {
  const user = usersById[id];

  if (!user) return null;
  const arr = [];

  if (user.last_name) {
    arr.push(user.last_name);
  }

  if (!arr.length) {
    arr.push(user.first_name);
  } else {
    const char = user.first_name.charAt(0);

    if (char) {
      arr.push(char + '.');
    }
  }

  if (!arr.length) {
    arr.push(user.email);
  }

  if (children) {
    return children(arr.join(' '));
  }
  return arr.join(' ');
};

// List of users' names
const UserListFunc = ({ids, usersById, spacer = ', '}) => {
  return ids.map(u => userName({id: u, usersById})).join(spacer);
};


const mapStateToProps = (state = {}) => {
  return {
    usersById: selectUsersById(state),
  };
};


export default connect(mapStateToProps)(userName);

export const UserList = connect(mapStateToProps)(UserListFunc);
