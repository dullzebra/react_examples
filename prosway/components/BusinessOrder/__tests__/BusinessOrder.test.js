import React from 'react';
import renderer from 'react-test-renderer';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import userReducer from '../../../../reducers/userReducer';
import { fetchUserOrders } from '_actions/';
import { FETCH_USER_ORDERS } from '_actions/types';
import {BusinessOrder} from '../BusinessOrder';
import orderResponse from '../__mock__/orderResponse';
import orderStore from '../__mock__/orderStore';

jest.mock('../OrdersList/OrdersList', () => () => 'OrdersList');

const mockFn = jest.fn(() => Promise.resolve({results:[], next: 'next'}));

const expectedProps = {
  fetchUserOrders: mockFn,
  orders: [],
};

const setupComponent = () => {
  return renderer.create(
    <BusinessOrder {...expectedProps} />
  );
};

const axiosInstance = axios.create();
const middleware = [thunk.withExtraArgument(axiosInstance)];
const mockStore = configureMockStore(middleware);
const reducerMock = combineReducers({user: userReducer});

describe('<BusinessOrder />', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render w/o crashing', () => {
    const component = setupComponent();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call fetchUserOrders', () => {
    expect(mockFn).toHaveBeenCalled();
  });

  it('should render <Показать ещё> button after fetchUserOrders call', () => {
    const component = setupComponent();
    mockFn().then(() => {
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

describe('BusinessOrder: async actions test', () => {
  let mock;
  const initState = {
    user: {
      orders: [],
    },
  };

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
    mock.onGet('order/').reply(200, orderResponse);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should create action FETCH_USER_ORDERS and put response items to store ', done => {
    const expectedAction = {
      type: FETCH_USER_ORDERS,
      payload: orderResponse,
    };

    let state = initState;
    const store = mockStore(() => state);
    store.dispatch(fetchUserOrders({}));

    setTimeout(() => {
      const actions = store.getActions();
      //console.log(actions);
      expect(actions).toContainEqual(expectedAction);

      state = reducerMock(state, expectedAction);
      //console.log(state);
      expect(state).toEqual({
        ...initState,
        user: {
          orders: orderStore,
        },
      });
      done();
    }, 1000);
  });
});
