/***********
 * Redux reducer file.
 *
 * All your reducer logic can go in this file in appReducer.
 ***********/

import { combineReducers } from "redux";
import { updateCompletedTasks } from "./utils";
import * as types from "./actionTypes";

const initialState = {
    user: null,
    incompleteTasks: [],
    completedTasks: [],
    isFetchingIncompleteTasks: false, 
    isFetchingCompleteTasks: false,
    isFetchingTasks: false,
    isPuttingTasks: false,
    isPuttingSingleTask: false
};

function appReducer(state = initialState, action) {
    switch (action.type) {
        case types.APP_LOGIN: {
            return { ...state, user: action.payload.user };
        }
        case types.FETCH_INCOMPLETE_TASKS_START: {
            return { ...state, isFetchingIncompleteTasks: true };
        }
        case types.FETCH_INCOMPLETE_TASKS_SUCCESS: {
            return { ...state, isFetchingIncompleteTasks: false, incompleteTasks: action.payload.tasks }
        }
        case types.FETCH_COMPLETED_TASKS_START: {
            return { ...state, isFetchingCompleteTasks: true };
        }
        case types.FETCH_COMPLETED_TASKS_SUCCESS: {
            return { ...state, isFetchingCompleteTasks: false }
        }
        case types.PUT_TASKS_START: {
            return { ...state, isPuttingTask: true };
        }
        case types.PUT_TASKS_SUCCESS: {
            return { ...state, isPuttingTask: false };
        }
        case types.PUT_SINGLE_TASK_START: {
            return { ...state, isPuttingTask: true };
        }
        case types.PUT_SINGLE_TASK_SUCCESS: {
            return { ...state, isPuttingTask: false };
        }
        case types.FETCH_INDIVIDUAL_TASK_START: {
            return { ...state, isFetchingTask: true };
        }
        case types.FETCH_INDIVIDUAL_TASK_SUCCESS: {
            state.completedTasks = updateCompletedTasks(state, action.payload.task);
            return { ...state, isFetchingTask: false };
        }
        case types.UPDATE_STORE_TODOS: {
            return { ...state, completedTasks: action.payload.completedTasks, incompleteTasks: action.payload.todoTasks }
        }
        default:
            return state;
    }
}

// combine all reducers into one main reducer
const rootReducer = combineReducers({
    app: appReducer
});

export default rootReducer;
