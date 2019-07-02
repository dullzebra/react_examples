import {
  GET_ORDERS,
  POST_ORDER,
  DELETE_ORDER,
  PATCH_ORDER,
} from '_actions/types';
import qs from 'qs';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ORDERS:
      return action.payload.results;
    case POST_ORDER:
      return [action.payload, ...state];
    case DELETE_ORDER:
      return state.filter(order => order.id !== action.payload);
    case PATCH_ORDER:
      const index = state.findIndex(order => order.id === action.payload.id);
      const copystate = [...state];
      copystate.splice(index, 1, action.payload);
      return copystate;
    default:
      return state;
  }
};


export const orderListParams = (state = {}, action) => {
  switch (action.type) {
    case GET_ORDERS:
      const params = action.payload.queryParams;

      if (!params.page) {
        params.page = 1;
      }

      return {
        ...params,
        total: action.payload.count,
        updated: Date.now(),
      };
    case PATCH_ORDER:
      return {
        ...state,
        updated: Date.now(),
      };
    default:
      return state;
  }
};
