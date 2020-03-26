/******
 * Mock APIs. Use the exported functions to understand how the API calls work.
 *
 * YOU ARE NOT ALLOWED TO MODIFY ANY CODE IN THIS FILE.
 ******/

/**
 * GET /tasks.
 *
 * The completed flag can be passed as true to get completed tasks, or false to get incomplete/to-do tasks.
 * This returns a list of tasks containing their IDs and description.
 */
export function getTasks(completed = false) {
    const tasks = completed ? completedTasks() : incompleteTasks();
    return makeApiPromise(tasks.map(reducedTask));
}

/**
 * GET /tasks/{id}
 *
 * GEt a task by its ID.
 * This will return a single task with all of its information.
 */
export function getTask(id) {
    return makeApiPromise({ ...findTask(id) });
}

/**
 * PUT /tasks/{id}
 *
 * Update a task. This will replace the entire task at the given ID with the given task.
 * However, if the given task is marked as "completed", then the completedDateTime will be populated by the server to the current time.
 * This returns an object containing only the id of the updated task.
 */
export function putTask(id, task) {
    const index = findTaskIndex(id);
    if (index < 0) {
        return makeApiPromise(null);
    } else {
        const { completed } = task;
        const { addedDateTime } = TASKS[index];

        TASKS[index] = { ...task, addedDateTime };
        if (completed) {
            TASKS[index].completedDateTime = new Date().toISOString();
        } else {
            delete TASKS[index].completedDateTime;
        }
        return makeApiPromise({ id });
    }
}

/**
 * GET /login
 *
 * Make a call to log the user in.
 */
export function login() {
    return new Promise(resolve => {
        LOGGED_IN = true;
        resolve({ name: 'React User' });
    });
}

/***
 * Internal mock server states and functions.
 ***/
let LOGGED_IN = false;

let TASKS = [
    buildCompletedTask(1, 'Start project'),
    buildCompletedTask(2, 'Complete Task 1'),
    buildTask(3, 'Mark Completed button'),
    buildTask(4, 'Mark To-Do button'),
    buildTask(5, 'Submit Apply button'),
    buildTask(6, 'Search filtering'),
    buildTask(7, 'Confirmation modal'),
    buildTask(8, 'Make sure all requirements are met'),
    buildTask(9, 'Zip and return ONLY src directory')
];

function buildTask(id, description, completed = false) {
    return {
        id,
        description,
        completed,
        addedDateTime: new Date().toISOString()
    };
}

function buildCompletedTask(id, description) {
    return {
        id,
        description,
        completed: true,
        addedDateTime: new Date().toISOString(),
        completedDateTime: new Date().toISOString()
    };
}

function reducedTask(task) {
    return { id: task.id, description: task.description };
}

function completedTasks() {
    return TASKS.filter(task => task.completed);
}

function incompleteTasks() {
    return TASKS.filter(task => !task.completed);
}

function findTask(id) {
    return TASKS.find(task => task.id === id);
}

function findTaskIndex(id) {
    return TASKS.findIndex(task => task.id === id);
}

function makeApiPromise(data) {
    const randomBadLuck = random(1, 6);
    const randomDelay = (randomBadLuck === 4 ? random(3000, 6000) : (random(1, 10) * random(1, 100)));

    return new Promise((resolve, reject) => {
        if (!LOGGED_IN) {
            reject("User must be logged in");
        } else {
            setTimeout(() => {
                if (data) {
                    resolve(data);
                } else {
                    reject({
                        error: {
                            status: 404,
                            message: 'Not Found'
                        }
                    });
                }
            }, randomDelay);
        }
    });
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
