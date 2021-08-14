import { CALL_API } from 'redux-api-middleware-native';
import objectAssign from 'object-assign';
export const SET_IP = 'network/SET_IP';
export const SET_RINGTONE = 'settings/SET_RINGTONE'

export function setIP(data) {
  return async dispatch => {
    await dispatch({
      type: SET_IP,
      meta: {
        done: true,
        value: data,
      },
    });
  };
}

export function setRingtone(data) {
  return async dispatch => {
    await dispatch({
      type: SET_RINGTONE,
      meta: {
        done: true,
        value: data,
      },
    });
  };
}


export const actions = {
  setIP,
  setRingtone
};

const actionHandlers = {};

actionHandlers[SET_IP] = (state, action) => {
  let newState;
  // console.log(action);
  newState = objectAssign({}, state);
  newState.hostname = action.meta.value;
  return newState;
};

actionHandlers[SET_RINGTONE] = (state, action) => {
  let newState;
  // console.log(action);
  newState = objectAssign({}, state);
  newState.ringtone_int = action.meta.value;
  return newState;
};

const initialState = {
  hostname: 'http://localhost:3333',
  ringtone_int: 0,
};

export default function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}
