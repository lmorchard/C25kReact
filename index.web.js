import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, connect } from 'react-redux';
import store from './common/lib/store';

export const App = connect(state => {
  return { workouts: state.workouts };
})(React.createClass({
  getInitialState() {
    return { selected: null };
  },
  render() {
    const { dispatch, workouts } = this.props;
    return (
      <WorkoutList dispatch={dispatch} workouts={workouts} />
    );
  }
}));

export const WorkoutList = ({ dispatch, workouts }) =>
  <ul className="workouts">
    {workouts.get('workouts').map((workout, index) =>
      <li key={index}>{workout.get('title')}</li>
    )}
  </ul>;

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('app')
);
