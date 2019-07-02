import { GET_CONTRACTS } from '_actions/types';
import keyBy from 'lodash/keyBy';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_CONTRACTS:
      const contracts = action.payload.results.map(contract => {
        const newContract = {...contract};
        newContract.items = keyBy(newContract.items, 'product');
        return newContract;
      });

      return keyBy(contracts, 'id');
    default:
      return state;
  }
};
