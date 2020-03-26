const getIndexFromArr = (arr, taskId) => arr.findIndex(e => e.id === taskId);

export const sortByDescription = arr => {
  return arr.sort((a, b) => a.description > b.description);
}

export const removeTaskAndUpdate = (arr, task) => {
  const updatedArr = arr.filter(el => (el.id !== task.id));
  return updatedArr;
}

export const updateTaskInArray = (arr, task) => {
  const index = getIndexFromArr(arr, task.id);
  if (index === -1) {
      arr.push(task);
  } else {
      arr[index] = task;
  }
  return arr;
}

export const updatePendingTasks = (tasks, updateState) => {
  tasks.map(task => task.pendingMove ? updateState(task) : null)
}

export const updateCompletedTasks = (state, task) => {
  const completedTasks = state.completedTasks;
  const index = getIndexFromArr(completedTasks, task.id);
  if (index === -1 && task.completed) {
    completedTasks.push(task);
  } else if (index >= 0) {
    if (!task.completed) {
      completedTasks.splice(index, 1);
    } else if (task.completed) {
      completedTasks[index] = task;  
    }
  } else {
    completedTasks[index] = task;
  }
  return completedTasks;
}