import { createStore, applyMiddleware } from 'redux';
import Immutable from 'immutable';

import * as actions from './actions';
import reducers from './reducers';

const data = require('../../data/c25k.json');

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
};

const createStoreWithMiddleware = applyMiddleware(logger)(createStore);

const store = createStoreWithMiddleware(reducers, {
  workouts: Immutable.fromJS(data),
  progress: Immutable.Map()
});
window.store = store;

export default store;
