import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Task1 from './Task1';
import Task2 from './Task2';
import '../App.css';


function App({ actions }) {
    /*
    * This is the main application component
    * You cannot modify this file except in the commented section below.
    * */
    const [bombCounter, setBombCounter] = useState(5);
    const [defused, setDefused] = useState(false);
    const [enableTask2, setEnableTask2] = useState(false);

    useEffect(() => {
        actions.app.login();
    });

    const buildLinks = () => {
        return (
            <div>
                <Link to='/'>Home</Link>
                <Link to='/task1'>Task 1</Link>
                {enableTask2 &&
                <Link to='/task2'>Task 2</Link>
                }
            </div>
        )
    };

    /************************************************************************
    * * START SECTION. MAKE YOUR CHANGES IN THIS SECTION HERE.
    * *
    * * You can MODIFY or ADD as many functions as you want here.
    ************************************************************************/

    const buildTask1 = () => <Task1 count={Math.round(bombCounter)} setEnableTask2={setEnableTask2} setDefused={setDefused} setBombCounter={setBombCounter} />;

    const buildTask2 = () => <Task2 />;

    /************************************************************************
     * * END SECTION.
     * *
     * * YOU CANNOT MODIFY ANY CODE OUTSIDE OF THIS SECTION IN THIS FILE!
     ***********************************************************************/

    if (!defused && bombCounter <= 0) {
        return <h1>BOOM!</h1>;
    }
    return (
        <div>
            <header>
                <h1>Welcome!</h1>
                <p>This is the landing page for the React/Redux exercise. Please read the requirements for each task in the project's README.</p>
                <p>Good luck!</p>
            </header>
            <Router>
                <div>
                    {buildLinks()}
                    <Switch>
                        <Route path='/task1' render={buildTask1}/>
                        <Route path='/task2' render={buildTask2}/>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            app: bindActionCreators(actions, dispatch)
        }
    };
}

export default connect(null, mapDispatchToProps)(App);
