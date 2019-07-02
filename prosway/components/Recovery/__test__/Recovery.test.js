import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { USER_RECOVERY_SUCCESS, API_INFO } from '_actions/types';
import { userPasswordReset } from '_actions/';
import { TestForm as Recovery } from '../Recovery';


const props = {
  params: {
    user: '117',
    token: '4yy-08f9cc52382aaaddf3bc',
  },
  redirect: jest.fn(),
  ping: jest.fn(),
  userPasswordReset: jest.fn(() => Promise.resolve()),
};

const setupComponent = () => {
  return renderer.create(
    <Provider store={configureMockStore()({})}>
      <Recovery {...props} />
    </Provider>
  );
};

describe('<Recovery />', () => {

  it('renders without crashing', () => {
    const component = setupComponent();
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('calls userPasswordReset() on form submit', () => {
    const component = setupComponent();
    const Form = component.root.findByType(Recovery);
    const form = Form.find(el => el.type === 'form');
    form.props.onSubmit();

    expect(props.userPasswordReset).toHaveBeenCalled();
  });
});

describe('<Recovery />', () => {
  const axiosInstance = axios.create();
  const middleware = [thunk.withExtraArgument(axiosInstance)];
  const mockStore = configureMockStore(middleware);
  let mock;
  let putData =   { 
     new_password: 'qwe123asd',
     new_password2: 'qwe123asd',
     token: 'abcd'
  };

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
    mock.onPut('user-password-reset/123/?user=123&token=abcd').reply(200);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should create action USER_RECOVERY_SUCCESS on userPasswordReset call', done => {
    const expectedActions = [{
      type: USER_RECOVERY_SUCCESS
    },
    {
      type: API_INFO,
      payload: 'Пароль успешно изменен',
    }];

    const store = mockStore();
    store.dispatch( userPasswordReset('123', 'abcd', putData) );

    setTimeout(() => {
      const actions = store.getActions(); 
      console.log(actions)
      expect(actions).toEqual(expectedActions);   

      done();
    }, 1000);
  });
});

