import ACTIONS from '../actions/gapi_actions';
import '../../common/gapi';
let gapi = window.gapi;

//Default state
const defaultState = {
  isAuthenticated: false,
  isLoadingFirstTime: true,
  files: [],
  uploadFileRes: false,
  updateFileRes: false
};

const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.Types.LOGIN:
      return action.payload;
      break;

    case ACTIONS.Types.LOG_OUT:
      gapi.auth2.getAuthInstance().signOut()
      return defaultState;
      break;

    case ACTIONS.Types.GET_FILES:
      return Object.assign({}, state, {files: action.payload});
      break;

    case ACTIONS.Types.IS_AUTHENTICATED:
      return Object.assign({}, state, {isAuthenticated: action.isAuthenticated});
      break;

    case ACTIONS.Types.UPLOAD_FILE:
      return Object.assign({}, state, {uploadFileRes: action.payload});
      break;

    case ACTIONS.Types.UPDATE_FILE:
      return Object.assign({}, state, {updateFileRes: action.payload});
      break;

    default:
      return state;
      break;
  }
};

export default appReducer;
