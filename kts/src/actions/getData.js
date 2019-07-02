import qs from 'qs';
import {GET_FAILED, POST_FAILED, DELETE_FAILED, PUT_FAILED, PATCH_FAILED} from '_actions/types';

const getData = (url, type, queryParams) => (dispatch, getState, api) => {
  return new Promise((resolve, reject) => {
    api.get(
      url, {
        params: queryParams,
        paramsSerializer(queryParams) {
          return qs.stringify(queryParams, {arrayFormat: 'repeat'});
        },
      }
    ).then(
      res => {
        res.data.queryParams = queryParams;
        dispatch({
          type,
          payload: res.data,
        });
        resolve(res.data);
      }
    )
      .catch(
        e => {
          dispatch({
            type: GET_FAILED,
          });
          reject(e.response);
        }
      );
  });
};

export const postData = (url, type, data) => (dispatch, getState, api) => {
  return new Promise((resolve, reject) => {
    api.post(url, data)
      .then(res => {
        dispatch({
          type,
          payload: res.data,
        });
        resolve(res.data);
      })
      .catch(res => {
        dispatch({
          type: POST_FAILED,
        });
        reject(res.response);
      });
  });
};

export const deleteData = (url, type, dispatchParams) =>
  (dispatch, getState, api) => {
    return new Promise((resolve, reject) => {
      api.delete(url)
        .then(res => {
          dispatch({
            type,
            payload: dispatchParams || {},
          });
          resolve(res);
        })
        .catch(res => {
          dispatch({
            type: DELETE_FAILED,
          });
          reject(res.response);
        });
    });
  };
export const putData = (url, type, data) => (dispatch, getState, api) => {
  return new Promise((resolve, reject) => {
    api.put(url, data)
      .then(res => {
        dispatch({
          type,
          payload: res.data,
        });
        resolve(res.data);
      })
      .catch(res => {
        dispatch({
          type: PUT_FAILED,
        });
        reject(res.response);
      });
  });
};


export const patchData = (url, type, data) => (dispatch, getState, api) => {
  return new Promise((resolve, reject) => {
    api.patch(url, data)
      .then(res => {
        dispatch({
          type,
          payload: res.data,
        });
        resolve(res.data);
      })
      .catch(res => {
        dispatch({
          type: PATCH_FAILED,
        });
        reject(res.response);
      });
  });
};

export default getData;

