import {GET_MANAGERS, GET_USERS} from '_actions/types';
import keyBy from 'lodash/keyBy';

export default (state = [], action) => {
  switch (action.type) {
    case GET_USERS:
      return action.payload.results;
    case GET_MANAGERS:
      return keyBy(action.payload.results, 'id');
    default:
      return state;
  }
};


export const usersById = (state = [], action) => {
  switch (action.type) {
    case GET_USERS:
      return keyBy(action.payload.results, 'id');
    default:
      return state;
  }
};


