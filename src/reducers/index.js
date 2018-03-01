import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import {reducer as toastrReducer} from 'react-redux-toastr';
import authReducer from './auth_reducer';

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  toastr: toastrReducer
});

export default rootReducer;
