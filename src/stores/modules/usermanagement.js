import {CALL_API} from 'redux-api-middleware-native';
import objectAssign from 'object-assign';

export const CREATE_USER_SUCCESS = 'usermanagement/CREATE_USER_SUCCESS';
export const CREATE_USER_ERROR = 'usermanagement/CREATE_USER_ERROR';
export const CREATE_USER_FAIL = 'usermanagement/CREATE_USER_FAIL';

export const GET_USERS_SUCCESS = 'usermanagement/GET_USERS_SUCCESS';
export const GET_USERS_ERROR = 'usermanagement/GET_USERS_ERROR';
export const GET_USERS_FAIL = 'usermanagement/GET_USERS_FAIL';

export const EDIT_USER_SUCCESS = 'usermanagement/EDIT_USER_SUCCESS';
export const EDIT_USER_ERROR = 'usermanagement/EDIT_USER_ERROR';
export const EDIT_USER_FAIL = 'usermanagement/EDIT_USER_FAIL';

export const CLEAR_USER_CREATION = 'usermanagement/CLEAR_USER_CREATION';

export function createUser(data) {
  return (dispatch, getState) => {
    let token = getState().auth.accessToken;
    return dispatch({
      [CALL_API]: {
        endpoint: `${getState().network.hostname}/v1/accounts/create`,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          CREATE_USER_SUCCESS,
          CREATE_USER_FAIL,
          {
            type: CREATE_USER_ERROR,
            payload: (action, state, payload) => {
              console.log(payload);
              return payload;
            },
          },
        ],
      },
    });
  };
}

export function editUser(data) {
  return (dispatch, getState) => {
    let token = getState().auth.accessToken;
    return dispatch({
      [CALL_API]: {
        endpoint: `${getState().network.hostname}/v1/accounts/edit`,
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          EDIT_USER_SUCCESS,
          EDIT_USER_FAIL,
          {
            type: EDIT_USER_ERROR,
            payload: (action, state, payload) => {
              console.log(payload);
              return payload;
            },
          },
        ],
      },
    });
  };
}

export function getUsers() {
  return (dispatch, getState) => {
    let token = getState().auth.accessToken;
    let hostname = getState().network.hostname;
    return dispatch({
      [CALL_API]: {
        endpoint: `${hostname}/v1/accounts/getUsers`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        types: [
          GET_USERS_SUCCESS,
          GET_USERS_FAIL,
          {
            type: GET_USERS_ERROR,
            payload: (action, state, payload) => {
              console.log(payload);
              return payload;
            },
          },
        ],
      },
    });
  };
}

export function clearUserCreation() {
  return async dispatch => {
    await dispatch({
      type: CLEAR_USER_CREATION,
      meta: {
        done: true,
      },
    });
  };
}

export const actions = {
  createUser,
  getUsers,
  clearUserCreation,
};

const actionHandlers = {};

actionHandlers[GET_USERS_SUCCESS] = (state, action) => {
  console.log('??');
  console.log(action);
  let newState;
  newState = objectAssign({}, state);
  newState.getUsersSuccess = true;
  newState.getUsersData = action.payload;
  newState.getUsersError = false;
  return newState;
};

actionHandlers[CLEAR_USER_CREATION] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.createUserSuccess = false;
  newState.createUserError = null;
  newState.createUserData = null;
  newState.editUserSuccess = false;
  newState.editUserData = null;
  newState.editUserError = false;
  return newState;
};

actionHandlers[GET_USERS_FAIL] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.getUsersSuccess = false;
  newState.getUsersData = null;
  newState.getUsersError = action.payload.error.message;
  return newState;
};

actionHandlers[GET_USERS_ERROR] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.getUsersSuccess = true;
  newState.getUsersData = null;
  newState.getUsersError = action.payload.message;
  return newState;
};

actionHandlers[CREATE_USER_SUCCESS] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.createUserSuccess = true;
  newState.createUserData = action.payload;
  newState.createUserError = false;
  return newState;
};

actionHandlers[CREATE_USER_FAIL] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.createUserSuccess = false;
  newState.createUserData = null;
  newState.createUserError = action.payload;
  return newState;
};

actionHandlers[CREATE_USER_ERROR] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.createUserSuccess = false;
  newState.createUserData = null;
  newState.createUserError = action.payload;
  return newState;
};

actionHandlers[EDIT_USER_SUCCESS] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.editUserSuccess = true;
  newState.editUserData = action.payload;
  newState.editUserError = false;
  return newState;
};

actionHandlers[EDIT_USER_FAIL] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.editUserSuccess = false;
  newState.editUserData = null;
  newState.editUserError = action.payload;
  return newState;
};

actionHandlers[EDIT_USER_ERROR] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.editUserSuccess = false;
  newState.editUserData = null;
  newState.editUserError = action.payload;
  return newState;
};

const initialState = {
  users: [],
  getUsersSuccess: false,
  getUsersFail: false,
  getUsersError: null,
  createUserSuccess: false,
  createUserError: false,
  createUserData: null,
  editUserSuccess: false,
  editUserData: null,
  editUserError: false,
  exception: null,
  getUsersData: [],
};

export default function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}
