import groupBy from 'lodash/groupBy';
import isArray from 'lodash/isArray';
import mergeWith from 'lodash/mergeWith';

export const getCommentsReducer = array => ({
  commentsByParentId: groupBy(array, 'parent'),
  commentsAmount: array.length,
});

export const postCommentsReducer = (state, payload) => {
  const commentsByParentId = {...state.commentsByParentId};
  let newParentIdArray = [payload];

  if (commentsByParentId[payload.parent]) {
    newParentIdArray = [...commentsByParentId[payload.parent], ...newParentIdArray];
  }
  commentsByParentId[payload.parent] = newParentIdArray;

  return {
    commentsByParentId,
    commentsAmount: state.commentsAmount + 1,
  };
};

export const deleteCommentsReducer = (state, payload) => {
  const {id, parent = null} = payload;
  const commentsByParentId = {...state.commentsByParentId};

  const newParentIdArray = commentsByParentId[parent].map(comment => {
    if (comment.id === id) {
      comment.user = null;
      comment.user_name = null;
      comment.user_email = null;
      comment.comment = null;
      comment.flags = null;
      comment.is_removed = true;
    }
    return comment;
  });
  commentsByParentId[parent] = newParentIdArray;

  return {
    commentsByParentId,
    commentsAmount: state.commentsAmount - 1,
  };
};


export const getNewCommentsReducer = (state, payload) => {
  const {count} = payload;
  const newCount = count - state.commentsAmount;

  if (!newCount) {
    return state;
  }

  const newResults = groupBy(payload.results.slice(-newCount), 'parent');

  return {
    commentsByParentId: mergeWith({...state.commentsByParentId}, newResults, mergeCustomizer),
    commentsAmount: count,
  };
};


const mergeCustomizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};
