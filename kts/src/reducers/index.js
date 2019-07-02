import { combineReducers } from 'redux';
import users, {usersById} from './users';
import contracts from './contracts';
import orders, {orderListParams} from './orders';
import announcements from './announcements';
import organizations from './organizations';
import products, {productsById} from './products';
import news from './news';
import ping from './ping';
import forum from './forum';
import orderComments from './orderComments';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  form: formReducer,
  announcements,
  orders,
  orderListParams,
  organizations,
  contracts,
  users,
  usersById,
  products,
  productsById,
  news,
  ping,
  forum,
  orderComments,
});
