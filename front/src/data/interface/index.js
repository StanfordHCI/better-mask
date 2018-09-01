const SET_TITLE = "interface/SET_TITLE";

const initialState = {
  Title: '',
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TITLE:
      return {
        ...state,
        Title: action.title,
      }
    default:
      return state;
  }
}

export function setTitle(title) {
  return dispatch => {
    document.title = title + " - Bettermask"

    dispatch({
      type: SET_TITLE,
      title,
    })
  }
}
