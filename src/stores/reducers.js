import {combineReducers} from 'redux';
import auth from './modules/auth';
import users from './modules/usermanagement';
import barangay from './modules/barangaymanagement';
import network from './modules/network';

export default combineReducers({
  auth: auth,
  users: users,
  barangay: barangay,
  network: network,
});
