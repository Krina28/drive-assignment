import {applyMiddleware, combineReducers, createStore} from "redux";
import reducer from "./reducers/gapi_reducer";
import reduxThunk from 'redux-thunk';

//combining all reducers
const rootReducer = combineReducers({
  reducer,
})

//configuring store
export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(reduxThunk));
  return store;
}
