import {
  GET_FORUM_SECTIONS,
  GET_FORUM_TOPICS,
  GET_FORUM_ITEM,
  GET_FORUM_COMMENTS,
  POST_FORUM_COMMENT,
  DELETE_FORUM_COMMENT,
  POST_FORUM_TOPIC,
  EDIT_FORUM_TOPIC,
  DELETE_FORUM_TOPIC,
  LOAD_MORE_FORUM_TOPICS,
} from '_actions/types';

import sortBy from 'lodash/sortBy';

import {
  getCommentsReducer,
  postCommentsReducer,
  deleteCommentsReducer,
} from './comments';

const initial = {
  sections: [],
  topics: {},
  topicsBySectionId: {},
  current: {},
  commentsByParentId: {},
  commentsAmount: 0,
};

export default (state = initial, action) => {
  switch (action.type) {
    case GET_FORUM_SECTIONS:
      return {
        ...state,
        sections: sortBy(action.payload.results, (o => !o.public)),
        next: action.payload.next,
        count: action.payload.count,
      };

    case GET_FORUM_TOPICS:
      const {
        results,
        next,
        queryParams: {
          forum: sectionId,
        },
      } = action.payload;


      return {
        ...state,
        topicsBySectionId: {
          ...state.topicsBySectionId,
          [sectionId]: {
            results,
            next: next ? next.split('?')[1] : next,
          },
        },
      };

    case LOAD_MORE_FORUM_TOPICS:
      const {
        results: loadMoreResults,
        next: loadMoreNext,
        queryParams: {
          forum: loadMoreSectionId,
        },
      } = action.payload;

      const newTopicsBySectionId = {...state.topicsBySectionId};
      newTopicsBySectionId[loadMoreSectionId].next = loadMoreNext ? loadMoreNext.split('?')[1] : loadMoreNext;
      newTopicsBySectionId[loadMoreSectionId].results =
        [...newTopicsBySectionId[loadMoreSectionId].results, ...loadMoreResults];

      return {
        ...state,
        topicsBySectionId: newTopicsBySectionId,
      };
    case GET_FORUM_ITEM:
      return {
        ...state,
        current: action.payload,
      };

    case GET_FORUM_COMMENTS:
      return {
        ...state,
        ...getCommentsReducer(action.payload.results),
      };

    case POST_FORUM_COMMENT:
      return {
        ...state,
        ...postCommentsReducer(state, action.payload),
      };

    case DELETE_FORUM_COMMENT:
      return {
        ...state,
        ...deleteCommentsReducer(state, action.payload),
      };
    case POST_FORUM_TOPIC:
      return {
        ...state,
      };
    case EDIT_FORUM_TOPIC:
      return {
        ...state,
      };
    case DELETE_FORUM_TOPIC:
      const topicsBySectionId = {
        ...state.topicsBySectionId,
        [action.payload.forum]:{
          next: state.topicsBySectionId[action.payload.forum].next,
          results: state.topicsBySectionId[action.payload.forum].results.filter(item => item.id !== action.payload.id),
        },
      };

      return {
        ...state,
        topicsBySectionId,
      };
    default:
      return state;
  }
};

