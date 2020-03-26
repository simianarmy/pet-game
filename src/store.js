import { applyMiddleware, compose, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import reducer from "./reducer";

const middleware = window.__REDUX_DEVTOOLS_EXTENSION__ ? compose(applyMiddleware(ReduxThunk), window.__REDUX_DEVTOOLS_EXTENSION__()) : compose(applyMiddleware(ReduxThunk));

export default createStore(reducer, middleware);
