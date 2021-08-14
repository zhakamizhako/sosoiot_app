import {CALL_API} from 'redux-api-middleware-native';
import objectAssign from 'object-assign';

export const GET_BARANGAYS_SUCCESS = 'auth/GET_BARANGAYS_SUCCESS';
export const GET_BARANGAYS_ERROR = 'auth/GET_BARANGAYS_ERROR';
export const GET_BARANGAYS_FAIL = 'auth/GET_BARANGAYS_FAIL';

export const CREATE_BARANGAY_SUCCESS = 'auth/CREATE_BARANGAY_SUCCESS';
export const CREATE_BARANGAY_ERROR = 'auth/CREATE_BARANGAY_ERROR';
export const CREATE_BARANGAY_FAIL = 'auth/CREATE_BARANGAY_FAIL';

export const EDIT_BARANGAY_SUCCESS = 'auth/EDIT_BARANGAY_SUCCESS';
export const EDIT_BARANGAY_ERROR = 'auth/EDIT_BARANGAY_ERROR';
export const EDIT_BARANGAY_FAIL = 'auth/EDIT_BARANGAY_FAIL';

export const CLEAR_BARANGAY_CREATION = 'auth/CLEAR_BARANGAY_CREATION';

export function createBarangay(data) {
  return (dispatch, getState) => {
    let token = getState().auth.accessToken;
    return dispatch({
      [CALL_API]: {
        endpoint: `${getState().network.hostname}/v1/barangay/create`,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          CREATE_BARANGAY_SUCCESS,
          CREATE_BARANGAY_FAIL,
          {
            type: CREATE_BARANGAY_ERROR,
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

export function editBarangay(data) {
  return (dispatch, getState) => {
    let token = getState().auth.accessToken;
    return dispatch({
      [CALL_API]: {
        endpoint: `${getState().network.hostname}/v1/barangay/edit`,
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          EDIT_BARANGAY_SUCCESS,
          EDIT_BARANGAY_FAIL,
          {
            type: EDIT_BARANGAY_ERROR,
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

export function getBarangays() {
  return (dispatch, getState) => {
    let token = getState().auth.accessToken;
    let hostname = getState().network.hostname;
    return dispatch({
      [CALL_API]: {
        endpoint: `${hostname}/v1/barangay/getbarangay`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        types: [
          GET_BARANGAYS_SUCCESS,
          GET_BARANGAYS_FAIL,
          {
            type: GET_BARANGAYS_ERROR,
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

export function clearBarangayCreation() {
  return async dispatch => {
    await dispatch({
      type: CLEAR_BARANGAY_CREATION,
      meta: {
        done: true,
      },
    });
  };
}

export const actions = {
  createBarangay,
  getBarangays,
  editBarangay,
  clearBarangayCreation,
};

const actionHandlers = {};

actionHandlers[GET_BARANGAYS_SUCCESS] = (state, action) => {
  console.log('??');
  console.log(action);
  let newState;
  newState = objectAssign({}, state);
  newState.getBarangaysSuccess = true;
  newState.getBarangaysData = action.payload;
  newState.getBarangaysError = false;

  return newState;
};

actionHandlers[GET_BARANGAYS_FAIL] = (state, action) => {
  console.log('::Fail?::');
  console.log(action.payload);
  let newState;
  newState = objectAssign({}, state);
  newState.getBarangaysSuccess = false;
  newState.getBarangaysData = null;
  newState.getBarangaysError = action.payload.error.message;
  return newState;
};

actionHandlers[GET_BARANGAYS_ERROR] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.getBarangaysSuccess = true;
  newState.getBarangaysData = null;
  newState.getBarangaysError = action.payload.message;
  return newState;
};

actionHandlers[CREATE_BARANGAY_SUCCESS] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.createBarangaySuccess = true;
  newState.createBarangayData = action.payload;
  newState.createBarangayError = false;
  return newState;
};

actionHandlers[CREATE_BARANGAY_FAIL] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.createBarangaySuccess = false;
  newState.createBarangayData = null;
  newState.createBarangayError = action.payload;
  return newState;
};

actionHandlers[CREATE_BARANGAY_ERROR] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.createBarangaySuccess = false;
  newState.createBarangayData = null;
  newState.createBarangayError = action.payload;
  return newState;
};

actionHandlers[EDIT_BARANGAY_SUCCESS] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.editBarangaySuccess = true;
  newState.editBarangayData = action.payload;
  newState.editBarangayError = false;
  return newState;
};

actionHandlers[EDIT_BARANGAY_FAIL] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.editBarangaySuccess = false;
  newState.editBarangayData = null;
  newState.editBarangayError = action.payload;
  return newState;
};

actionHandlers[EDIT_BARANGAY_ERROR] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.editBarangaySuccess = false;
  newState.editBarangayData = null;
  newState.editBarangayError = action.payload;
  return newState;
};

actionHandlers[CLEAR_BARANGAY_CREATION] = (state, action) => {
  let newState;
  newState = objectAssign({}, state);
  newState.createBarangaySuccess = false;
  newState.createBarangayData = null;
  newState.createBarangayError = null;
  newState.editBarangaySuccess = false;
  newState.editBarangayData = null;
  newState.editBarangayError = false;
  return newState;
};

const initialState = {
  getBarangaysSuccess: false,
  getBarangaysFail: false,
  getBarangaysError: null,
  createBarangaySuccess: false,
  createBarangayError: false,
  createBarangayData: null,
  editBarangaySuccess: false,
  editBarangayError: false,
  editBarangayData: null,
  getBarangaysData: [],
};

export default function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}
