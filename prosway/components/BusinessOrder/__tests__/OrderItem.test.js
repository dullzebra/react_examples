import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { TestForm as OrderItem } from '../OrdersList/OrderItem';
import { Provider } from 'react-redux';

jest.mock('_components/Form/FieldSimpleSelect/FieldSimpleSelect', () => 'FieldSimpleSelect');

const mockSubmit = jest.fn();
const mockOpenUserContact = jest.fn();

const expectedProps = {
  item: {
    id: 'abc',
    start: '2018-08-10T16:00:02Z',
    end: '2018-08-10T17:00:02Z',
    status: '?',
    item_object: {
      title: 'Курс вышивания крестиком',
      parent_object: {
        title: 'Дворец пионеров',
      },
    },
    user_object: {
      email: 'pechkin@prosvet.io',
      first_name: 'Почтальон',
      last_name: 'Печкин',
      phone: '0123467',
    },
  },
  weekDays: [
    { id: 0, name: 'Понедельник' },
    { id: 1, name: 'Вторник' },
    { id: 2, name: 'Среда' },
    { id: 3, name: 'Четверг' },
    { id: 4, name: 'Пятница' },
    { id: 5, name: 'Суббота' },
    { id: 6, name: 'Воскресенье' },
  ],
  form: 'ItemFormName',
  initialValues: { time: '9:00', weekday: 4 },
  formValues: { time: '10:00', weekday: 3 },
  openUserContact: mockOpenUserContact,
  patchUserOrder: mockSubmit,
};


const mockStore = configureMockStore();

const setupComponent = () => {
  return renderer.create(
    <Provider store={mockStore({})}>
      <OrderItem {...expectedProps} />
    </Provider>
  );
};

describe('<OrderItem />', () => {
  it('should render w/o crashing', () => {
    const component = setupComponent();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call "patchUserOrder" method on form submit', () => {
    const component = setupComponent();
    const instance = component.root;
    const form = instance.find(el => el.type === 'form');

    form.props.onSubmit();
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('should call "openUserContact" on "Связаться с клиентом" button press', () => {
    const component = setupComponent();
    const instance = component.root;
    const button = instance.find(el => el.type === 'button' && el.children && el.children[0] === 'Связаться с клиентом');

    button.props.onClick();
    expect(mockOpenUserContact).toHaveBeenCalled();
  });
});
