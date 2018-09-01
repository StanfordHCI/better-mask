import extend from 'xtend'

// Actions
const OPEN_FROM_DROPDOWN = 'send/OPEN_FROM_DROPDOWN'
const CLOSE_FROM_DROPDOWN = 'send/CLOSE_FROM_DROPDOWN'
const OPEN_TO_DROPDOWN = 'send/OPEN_TO_DROPDOWN'
const CLOSE_TO_DROPDOWN = 'send/CLOSE_TO_DROPDOWN'
const UPDATE_SEND_ERRORS = 'send/UPDATE_SEND_ERRORS'

const initState = {
  fromDropdownOpen: false,
  toDropdownOpen: false,
  errors: {},
}

// Reducer
export default function reducer (state = initState, action) {
  switch (action.type) {
    case OPEN_FROM_DROPDOWN:
      return {
        ...state,
        fromDropdownOpen: true,
      };
    case CLOSE_FROM_DROPDOWN:
      return {
        ...state,
        fromDropdownOpen: false,
      };
    case OPEN_TO_DROPDOWN:
      return {
        ...state,
        toDropdownOpen: true,
      };
    case CLOSE_TO_DROPDOWN:
      return {
        ...state,
        toDropdownOpen: false,
      };
    case UPDATE_SEND_ERRORS:
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.value,
        },
      };
    default:
      return state;
  }
}

// Action Creators
export function openFromDropdown () {
  return { type: OPEN_FROM_DROPDOWN }
}

export function closeFromDropdown () {
  return { type: CLOSE_FROM_DROPDOWN }
}

export function openToDropdown () {
  return { type: OPEN_TO_DROPDOWN }
}

export function closeToDropdown () {
  return { type: CLOSE_TO_DROPDOWN }
}

export function updateSendErrors (errorObject) {
  return {
    type: UPDATE_SEND_ERRORS,
    value: errorObject,
  }
}
