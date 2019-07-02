import {
  GET_ORDER_COMMENTS,
  POST_ORDER_COMMENT,
  GET_NEW_ORDER_COMMENTS,
} from '_actions/types';

import {
  getCommentsReducer,
  postCommentsReducer,
  getNewCommentsReducer,
} from './comments';

const initial = {
  commentsByParentId: {},
  commentsAmount: 0,
};

export default (state = initial, action) => {
  switch (action.type) {
    case GET_ORDER_COMMENTS:
      return {
        ...state,
        ...getCommentsReducer(action.payload.results),
      };

    case POST_ORDER_COMMENT:
      return {
        ...state,
        ...postCommentsReducer(state, action.payload),
      };

    case GET_NEW_ORDER_COMMENTS:
      return {
        ...state,
        ...getNewCommentsReducer(state, action.payload),
      };

    default:
      return state;
  }
};
