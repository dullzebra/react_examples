import { GET_PRODUCTS } from '_actions/types';
import keyBy from 'lodash/keyBy';
import uniqBy from 'lodash/uniqBy';

export default (state = [], action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return uniqBy([...state, ...action.payload.results], 'id');
    default:
      return state;
  }
};

export const productsById = (state = {}, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        ...keyBy(action.payload.results, 'id'),
      };
    default:
      return state;
  }
};

