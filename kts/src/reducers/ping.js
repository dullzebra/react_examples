import {
  PING,
} from '_actions/types';

import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';

export default (state = { user: {} }, action) => {
  switch (action.type) {
    case PING:
      const permissions = action.payload.user ? action.payload.user.permissions : [];
      return {
        ...action.payload,
        user: {
          ...action.payload.user,
          permissions: composePermissions(permissions),
        },
      };
    default:
      return state;
  }
};


const composePermissions = arr => {
  try {
    // We need only permission props that begins with 'kts.view_' or 'kts.change_'
    let result = arr.filter(item => /^(kts.view_|kts.change_)/.test(item));

    // Map array to object by type {view: [order, announcement, ...], change: [order, announcement, ...]}
    result = groupBy(result, str => /^kts.view_/.test(str) ? 'view' : 'change');
    forEach(result, (value, key) => {
      result[key] = value.map( str => str.replace(`kts.${key}_`, '') );
    });

    return result;
  } catch (e) {
    console.log(e);
    return {};
  }
};
