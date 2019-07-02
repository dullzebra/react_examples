import {GET_ANNOUNCEMENT, GET_ANNOUNCEMENTS} from '_actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ANNOUNCEMENTS:
      return action.payload.results;
    case GET_ANNOUNCEMENT:
      return [
        ...state,
        action.payload,
      ];
    default:
      return state;
  }
};
