import { createStore, applyMiddleware, combineReducers } from 'redux';

const data = require('../../data/c25k.json');

const SET_WORKOUT_PROGRESS = 'SET_WORKOUT_PROGRESS';

function title(state={}, action) {
  return state;
}

function workouts(state={}, action) {
  return state;
}

function progress(state={}, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case SET_WORKOUT_PROGRESS:
      const { workoutId, time } = action;
      newState[workoutId] = time;
      break;
  }
  return newState;
}

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
};

export const actions = {
  setWorkoutProgress(workoutId, time) {
    return { type: SET_WORKOUT_PROGRESS, workoutId, time };
  }
}

const reducers = combineReducers({
  title, workouts, progress
});

export const store = applyMiddleware(logger)(createStore)(reducers, {
  title: data.title,
  workouts: data.workouts,
  progress: {}
});
