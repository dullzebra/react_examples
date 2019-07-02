import {
  GET_NEWS,
  GET_MORE_NEWS,
  GET_NEWS_COMMENTS,
  POST_NEWS_COMMENT,
  DELETE_NEWS_COMMENT,
  GET_NEWS_ITEM,
} from '_actions/types';

import {
  getCommentsReducer,
  postCommentsReducer,
  deleteCommentsReducer,
} from './comments';

const initial = {
  list: [],
  next: null,
  current: {},
  commentsByParentId: {},
  commentsAmount: 0,
};

export default (state = initial, action) => {
  switch (action.type) {
    case GET_NEWS:
      return {
        ...state,
        list: action.payload.results,
        next: action.payload.next ? action.payload.next.split('?')[1] : action.payload.next,
      };
    case GET_MORE_NEWS:
      return {
        ...state,
        list: [...state.list, ...action.payload.results],
        next: action.payload.next ? action.payload.next.split('?')[1] : action.payload.next,
      };
    case GET_NEWS_ITEM:
      return {
        ...state,
        current: action.payload,
      };
    case GET_NEWS_COMMENTS:
      return {
        ...state,
        ...getCommentsReducer(action.payload.results),
      };
    case POST_NEWS_COMMENT:
      return {
        ...state,
        ...postCommentsReducer(state, action.payload),
      };

    case DELETE_NEWS_COMMENT:
      return {
        ...state,
        ...deleteCommentsReducer(state, action.payload),
      };

    default:
      return state;
  }
};
