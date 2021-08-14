import {CALL_API} from 'redux-api-middleware-native';
import objectAssign from 'object-assign';

export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'auth/LOGIN_ERROR';
export const LOGIN_FAIL = 'auth/LOGIN_FAIL';

export const CHECK_ME_SUCCESS = 'auth/CHECK_ME_SUCCESS';
export const CHECK_ME_ERROR = 'auth/CHECK_ME_ERROR';
export const CHECK_ME_FAIL = 'auth/CHECK_ME_FAIL';

export const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
// export const SET_IP = 'network/SET_IP';

export function login(data) {
  console.log('::LOGIN:::');
  console.log(this);
  return (dispatch, getState) => {
    let hostname = getState().network.hostname;
    return dispatch({
      [CALL_API]: {
        endpoint: `${hostname}/v1/accounts/login`,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        types: [
          LOGIN_SUCCESS,
          LOGIN_FAIL,
          {
            type: LOGIN_ERROR,
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

export function logout() {
  return async dispatch => {
    await dispatch({
      type: LOGOUT_SUCCESS,
      meta: {
        done: true,
      },
    });
  };
}

export function checkMe(data) {
  return (dispatch, getState) => {
    let hostname = getState().network.hostname;
    return dispatch({
      [CALL_API]: {
        endpoint: `${hostname}/v1/accounts/me`,
        method: 'GET',
        // body: data,
        headers: {
          Authorization: `Bearer ${data}`,
        },
        types: [
          CHECK_ME_SUCCESS,
          CHECK_ME_FAIL,
          {
            type: CHECK_ME_ERROR,
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

export const actions = {
  login,
  checkMe,
  logout,
};

const actionHandlers = {};

actionHandlers[LOGOUT_SUCCESS] = () => {
  return initialState;
};

// actionHandlers[SET_IP] = (state, action) => {
//   let newState;
//   // console.log(action);
//   newState = objectAssign({}, state);
//   newState.hostname = action.meta.value;
//   return newState;
// };

actionHandlers[LOGIN_SUCCESS] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.loginSuccess = true;
  newState.loginError = false;
  newState.loginData = action.payload.user;
  newState.accessToken = action.payload.accessToken;
  return newState;
};

actionHandlers[LOGIN_FAIL] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.loginSuccess = false;
  newState.connectionError = null;
  newState.loginError = action.payload.error.message;
  return newState;
};

actionHandlers[LOGIN_ERROR] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.loginError = null;
  newState.connectionError = action.payload.message;
  return newState;
};

actionHandlers[CHECK_ME_SUCCESS] = (state, action) => {
  console.log('User token check');
  let newState;
  newState = objectAssign({}, state);
  newState.tokenCheck = true;
  return newState;
};

actionHandlers[CHECK_ME_FAIL] = (state, action, test1, test2) => {
  console.log('Token check fail');
  let newState;
  newState = objectAssign({}, state);
  newState.loginSuccess = false;
  newState.loginError = action.payload.error.message;
  return newState;
};

actionHandlers[CHECK_ME_ERROR] = (state, action) => {
  console.log('Token check error.');
  let newState;
  newState = objectAssign({}, state);
  return newState;
};

actionHandlers[LOGOUT_SUCCESS] = (state, action) => {
  return initialState;
};

const initialState = {
  loginError: false,
  loginSuccess: false,
  loginData: null,
  accessToken: null,
  tokenSuccess: false,
  connectionError: false,
};

export default function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}
