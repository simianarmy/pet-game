import React, { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Task1 component.
 *
 * DO NOT CONVERT TO A CLASS COMPONENT!
 * THIS COMPONENT SHOULD STAY A FUNCTION COMPONENT
 *
 * You can modify this file however you wish.
 */
function Task1({ count, setDefused, setBombCounter, setEnableTask2 }) {

  useEffect(() => {
      setTimeout(() => {
        if (count > 1) {
          setBombCounter(count - 1);
        } else {
          setDefused(true);
          setEnableTask2(true);
          setBombCounter(0);
        }
      }, 1000);
  }, [count, setBombCounter, setDefused, setEnableTask2]);

    /*
    const requestRef = useRef();
    const previousTimeRef = useRef();

    const animateCountdown = useCallback(time => {
        let finished = false;
        if (typeof previousTimeRef.current !== 'undefined') {
            const deltaTime = time - previousTimeRef.current;

            // pass on a function to the setter of the state
            // to make sure we always have the latest state
            setBombCounter(prevBombCount => {
                if (prevBombCount > 0) {
                    return (prevBombCount - deltaTime * 0.001) % 100
                } else {
                    setDefused(true); // we secretly defuse the bomb for the user here
                    setEnableTask2(true);
                    finished = true;
                    return 0;
                }
            });
        }
        previousTimeRef.current = time;
        if (!finished) {
            requestRef.current = requestAnimationFrame(animateCountdown);
        }
    }, [setBombCounter, setDefused, setEnableTask2])

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animateCountdown);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animateCountdown]);
    */

    return (
        <div className="countdown">{count}</div>
    );
}

Task1.propTypes = {
    /**
     * A countdown value that must reach 0.
     */
    count: PropTypes.number.isRequired,

    /**
     * A function to enable the second task. Call this at the end of your countdown.
     */
    setEnableTask2: PropTypes.func.isRequired,

    /**
     * A function that will defuse the bomb
     */
    setDefused: PropTypes.func.isRequired
};

export default Task1;
