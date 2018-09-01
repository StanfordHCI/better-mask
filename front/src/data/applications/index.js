const RECEIVE_APPLICATION = "applications/RECEIVE_APPLICATION";

const initialState = {
  applications: {},
};

export default function applicationsReducer(state = initialState, action) {
  switch(action.type) {
    case RECEIVE_APPLICATION:
      const app = action.application;
      return {
        ...state,
        applications: {
          ...state.applications,
          [app.id]: app,
        }
      }
    default: return state;
  }
}

export const receiveApplication = (application) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_APPLICATION,
      application,
    })
  }
}
