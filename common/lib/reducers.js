import { combineReducers } from 'redux';
import Immutable, { List } from 'immutable';

import * as actions from './actions';

export function workouts(state={}, action) {
  return state;
}

export function progress(state={}, action) {
  switch (action.type) {
    case actions.SET_WORKOUT_PROGRESS:
      return progress_setWorkoutProgress(state, action);
    default:
      return state;
  }
}

function progress_setWorkoutProgress(state, action) {
  const { workoutId, time } = action;
  return state.update(workoutId, oldTime => time);
}

export default combineReducers({
  workouts,
  progress
});
