/***********
 * Redux actions file.
 *
 * All your actions should be declared here.
 ***********/

import * as types from './actionTypes';
import * as api from './api';

/**
 * This is an action to mock a login API call, for your reference.
 */
export function login() {
    return dispatch => {
        return api.login()
            .then(user => {
                return dispatch({ type: types.APP_LOGIN, payload: { user } })
            });
    }
}

/**
 * Fetches a list of incomplete tasks with reduced data
 */
export function requestIncompleteTasks() {
    return dispatch => {
        dispatch({ type: types.FETCH_INCOMPLETE_TASKS_START });
        return api.getTasks()
            .then(tasks => {
                return dispatch({ type: types.FETCH_INCOMPLETE_TASKS_SUCCESS, payload: { tasks } })
            })
    }
}

/**
 * Fetches a list of completed tasks with reduced data
 */
export function requestCompletedTasks() {
    return dispatch => {
        dispatch({ type: types.FETCH_COMPLETED_TASKS_START });
        return api.getTasks(true)
            .then(tasks => {
                return dispatch(requestCompletedTasksInfo(tasks));
            });
    }
}

/**
 * Fetches an individual task
 * @param {number} id 
 */
export function requestIndividualTask(id) {
    return dispatch => {
        dispatch({ type: types.FETCH_INDIVIDUAL_TASK_START });
        return api.getTask(id)
            .then(task => {
                return dispatch({ type: types.FETCH_INDIVIDUAL_TASK_SUCCESS, payload: { task }  })
            });
    }
}

/**
 * Fetches a list of completed tasks with extended information
 * @param {Array} tasks 
 */
export function requestCompletedTasksInfo(tasks) {
    return dispatch => {
        Promise.all(tasks.map(
            async (task) => await dispatch(requestIndividualTask(task.id)))).then( () => {
                dispatch({ type: types.FETCH_COMPLETED_TASKS_START })
            });
    }
}

/**
 * PUT updates an individual task
 * @param {number} id 
 * @param {object} task 
 */
export function requestPutTask(id, task) {
    return dispatch => {
        dispatch({ type: types.PUT_SINGLE_TASK_START });
        return api.putTask(id, task)
            .then(taskId => {
                return dispatch({ type: types.PUT_SINGLE_TASK_SUCCESS })
            });
    }
}

/**
 * PUT updates a list of tasks
 * @param {array} tasks 
 */
export function requestPutTasks(tasks) {
    return dispatch => {
        dispatch({ type: types.PUT_TASKS_START });
        return Promise.all(tasks.map(
                async task => await dispatch(requestPutTask(task.id, task))
            )).then(() => {
                dispatch({ type: types.PUT_TASKS_SUCCESS });
            })
    }
}

/**
 * Update the store with the updated states for
 * completed and incompleted tasks then get info
 */
export function updateTodoStore(todoTasks, completedTasks) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            resolve(dispatch({ type: types.UPDATE_STORE_TODOS, payload: { todoTasks, completedTasks } }))
        }).then(() => {
                // we want to get the completed dates
                dispatch(requestCompletedTasks());
            })
    }
}