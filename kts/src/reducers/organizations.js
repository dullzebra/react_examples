import { GET_ORGANIZATIONS } from '_actions/types';
import keyBy from 'lodash/keyBy';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ORGANIZATIONS:
      const organizations = action.payload.results;
      return keyBy(organizations, 'id');
    default:
      return state;
  }
};
