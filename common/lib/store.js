import { createStore, applyMiddleware, combineReducers } from 'redux';

function prepareInitialState() {
  const workoutData = require('../../data/c25k.json');

  const state = {
    title: workoutData.title,
    currentView: 'home',
    selectedWorkout: null,
    workouts: workoutData.workouts,
    progress: {}
  };

  // Pre-calculate start/end times for each workout event
  state.workouts.forEach(workout => {
    let time = 0;
    workout.events.forEach(event => {
      event.start = time;
      time += event.duration * 1000;
      event.end = time;
    });
  });

  return state;
};

function title(state='', action) {
  return state;
}

function currentView(state='', action) {
  return state;
}

function selectedWorkout(state='', action) {
  return state;
}

function workouts(state=[], action) {
  return state;
}

const SET_WORKOUT_PROGRESS = 'SET_WORKOUT_PROGRESS';

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

export const store = createStore(
  combineReducers({title, currentView, selectedWorkout, workouts, progress}),
  prepareInitialState(),
  applyMiddleware(logger)
);

export const utils = {
  calculateMaxWorkoutTime(workouts) {
    return workouts.map(w =>
      w.events.reduce((acc, ev) => acc + ev.duration, 0)
    ).reduce((acc, curr) => Math.max(acc, curr), 0);
  }
};
