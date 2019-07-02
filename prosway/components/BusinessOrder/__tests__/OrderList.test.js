import React from 'react';
import renderer from 'react-test-renderer';

import {OrdersList} from '../OrdersList/OrdersList';
jest.mock('../OrdersList/OrderItem', () => ({item}) => `OrderItem id: ${item.id} , status: ${item.status}`);
jest.mock('react-modal', () => 'Modal');

const expectedProps = {
  items: [],
  weekdays: [],
};

const expectedProps2 = {
  items: [{
    id: 'abc',
    status: '+',
  },
  {
    id: 'abc123',
    status: '?',
  },
  {
    id: 'abc000',
    status: '-',
  }],
  weekdays: [],
};

const setupComponent = (props) => {
  return renderer.create(
    <OrdersList {...props} />
  );  
};

describe('<OrdersList />', () => {
  it('should render w/o crashing', () => {
    const component = setupComponent(expectedProps);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render list of items with statuses (?|+)', () => {
    const component = setupComponent(expectedProps2);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should open <OrderUserContact> with data on "openPopup" method call', () => {
    const component = setupComponent(expectedProps2);
    component.getInstance().openPopup('Иван Иваныч', '+7 919 9111111', 'ivanych@procvet.io');
    const modal = component.root.find(el => el.type === 'Modal');
    const tree = component.toJSON();

    expect(modal.props.isOpen).toBe(true);
    expect(tree).toMatchSnapshot();
  });
});
