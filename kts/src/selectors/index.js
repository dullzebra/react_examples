import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);

export const selectOrdersById = createDeepEqualSelector(
  state => state.orders,
  orders => keyBy(orders, 'id')
);

export const selectCurrentUserId = createSelector(
  state => state.ping.user,
  user => user ? user.id : null
);

export const selectUsersById = createSelector(
  state => state.usersById,
  user => user
);

export const selectLocationState = createDeepEqualSelector(
  (_, props) => props.location,
  location => location.state || {}
);

export const selectLocationStateContract = createDeepEqualSelector(
  selectLocationState,
  locationState => locationState.contract
);

export const selectLocationStateItemsById = createDeepEqualSelector(
  selectLocationState,
  locationState => locationState.items ? keyBy(locationState.items, 'product') : {}
);

export const selectLocationStateItemsKeys = createDeepEqualSelector(
  selectLocationStateItemsById,
  itemsById => Object.keys(itemsById)
);

export const selectContractNumbers = createDeepEqualSelector(
  state => state.contracts,
  contracts => {
    const notEmptyContracts = filter(contracts, c => c.is_available);

    if (notEmptyContracts.length === 1) {
      return map(notEmptyContracts, c => ({id: c.id}));
    }
    return map(notEmptyContracts, c => ({id: c.id, number: c.number}));
  }
);


export const selectUsersWithOrganizations = createDeepEqualSelector(
  state => state.users,
  state => state.organizations,
  (users, organizations) =>
    users.map(u => {
      const uo = {...u};

      if (u.organization && organizations[u.organization]) {
        uo.organization = organizations[u.organization].name;
      }
      return uo;
    })
);

export const selectOrderCommentsFlatList = createDeepEqualSelector(
  state => state.orderComments,
  // take first-level only (key='null')
  comments => comments.commentsByParentId.null
    ? comments.commentsByParentId.null.filter(item => !item.is_removed)
    : []
);
