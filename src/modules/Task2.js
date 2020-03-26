import React, { Component } from 'react';
import PropTypes, { object } from 'prop-types';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { sortByDescription, removeTaskAndUpdate, updateTaskInArray, updatePendingTasks } from "../utils";
import * as actions from '../actions';
import Loader from '../components/Loader';

/**
 * Task2 component.
 *
 * DO NOT CONVERT TO A FUNCTION COMPONENT AND DO NOT USE HOOKS!
 * THIS COMPONENT SHOULD STAY A CLASS COMPONENT
 * USE TRADITIONAL STATE MANAGEMENT AND LIFECYCLE METHODS IF NECESSARY
 *
 * You can modify this class component however you wish.
 *
 */

const TASK_TYPE = {
    TODO: 'todoTasks',
    COMPLETED: 'completedTasks'
};

class Task2 extends Component {
    static propTypes = {
        incompleteTasks: PropTypes.arrayOf(object),
        completedTasks: PropTypes.arrayOf(object),
        isFetchingCompleteTasks: PropTypes.bool
    }

    state = {
        todoTasks: [],
        completedTasks: []
    }

    componentDidMount() {
        // this.props.actions.app.login(); // TODO: uncomment for debugging
        this.props.actions.app.requestIncompleteTasks();
        this.props.actions.app.requestCompletedTasks();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isFetchingIncompleteTasks !== this.props.isFetchingIncompleteTasks) {
            this.setState({
                todoTasks: sortByDescription(this.props.incompleteTasks.slice(0)),
            });
        }

        if (prevProps.isFetchingCompleteTasks !== this.props.isFetchingCompleteTasks) {
            this.setState({
                completedTasks: sortByDescription(this.props.completedTasks.slice(0)),
            });
        }
    }

    fetchPutTasks = (todoTasks, completedTasks) => {
        const combinedTasks = [...todoTasks, ...completedTasks];
        this.props.actions.app.requestPutTasks(combinedTasks).finally(
            () => {
                this.props.actions.app.updateTodoStore(todoTasks, completedTasks);
            }
        );
    }

    handleTaskReadyChange = (task, taskType) => () => {
        this.setState(prevState => ({
            [taskType]: updateTaskInArray(prevState[taskType], { ...task, pendingMove: !task.pendingMove  })
        }))
    }

    handleMarkComplete = () => {
        const updateState = (task) => (
            this.setState(prevState => ({
                todoTasks: removeTaskAndUpdate(prevState.todoTasks, task),
                completedTasks: sortByDescription(updateTaskInArray(prevState.completedTasks, { ...task, pendingMove: false, completed: true }))
            }))
        );

        updatePendingTasks(this.state.todoTasks, updateState);
    }

    handleMarkTodo = () => {
        const updateState = (task) => (
            this.setState(prevState => ({
                todoTasks: sortByDescription(updateTaskInArray(prevState.todoTasks, { ...task, pendingMove: false, completed: false })),
                completedTasks: removeTaskAndUpdate(prevState.completedTasks, task)
            }))
        );

        updatePendingTasks(this.state.completedTasks, updateState);
    }

    handleSubmit = () => {
        this.fetchPutTasks(this.state.todoTasks, this.state.completedTasks)
    }

    setDisabledButton = () => {
        return this.props.isFetchingCompleteTasks || this.props.isFetchingIncompleteTasks || this.props.isPuttingTask
    }

    buildTask = taskType => task => (
        <div className="task" key={ task.id }>
            <input type="checkbox" onChange={this.handleTaskReadyChange(task, taskType)} />
            <span>{ task.description } &nbsp; { taskType === TASK_TYPE.COMPLETED ? task.completedDateTime : null } </span>
        </div>
    );

    buildTodoTable = tasks => (
        <div className="left">
            <h3>To-Do</h3>
            <div className="table">
                {
                    this.props.isFetchingIncompleteTasks ? 
                    <Loader />
                    :
                    tasks.map(this.buildTask(TASK_TYPE.TODO))
                }
            </div>
            <button onClick={this.handleMarkComplete}>Mark Completed</button>
        </div>
    );

    buildCompletedTable = tasks => (
        <div className="right">
            <h3>Completed</h3>
            <div className="table">
                {
                    this.props.isFetchingCompleteTasks ?
                    <Loader />
                    :
                    tasks.map(this.buildTask(TASK_TYPE.COMPLETED))
                }
            </div>
            <button onClick={this.handleMarkTodo}>Mark To-Do</button>
        </div>
    );

    render() {
        const { todoTasks, completedTasks } = this.state;

        return (
            <div className="task-table">
                {this.buildTodoTable(todoTasks)}
                {this.buildCompletedTable(completedTasks)}
                <button type="submit" disabled={this.setDisabledButton()} onClick={this.handleSubmit}>
                    {
                        this.setDisabledButton() ?
                        <Loader />
                        :
                        'Submit'
                    }
                </button>
            </div>
        );
    }
}

/**
 * These functions connect the component to the redux store.
 * They are here for your convenience, and you do not have to use them.
 */
function mapStateToProps(state) {
    const {
        app: {
            incompleteTasks,
            completedTasks,
            isFetchingCompleteTasks,
            isFetchingIncompleteTasks,
            isPuttingTasks
        }
    } = state;
    return {
        incompleteTasks,
        completedTasks,
        isFetchingCompleteTasks,
        isFetchingIncompleteTasks,
        isPuttingTasks
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            app: bindActionCreators(actions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Task2);
