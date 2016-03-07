import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, connect } from 'react-redux';
import { actions, store, utils } from './common/lib/store';

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

export const WorkoutList = ({ dispatch, workouts }) => {

  // Calculate the total duration of the longest workout.
  const maxWorkoutTime = utils.calculateMaxWorkoutTime(workouts);

  // Calculate width of a second with respect to total width of screen.
  const barWidth = 400; //
  const widthRatio = barWidth / maxWorkoutTime;

  return (
    <ul className="workouts">
      {workouts.map((workout, index) =>
        <li key={index}>
          <p>{workout.title}</p>
          <WorkoutBar workout={workout}
                      barHeight={40} barWidth={barWidth}
                      widthRatio={widthRatio} />
        </li>
      )}
    </ul>
  );
};

const WorkoutBar = ({ dispatch, workout, barHeight, barWidth, widthRatio }) =>
  <div style={{
        display: 'block',
        width: barWidth,
        height: barHeight }}>
    {workout.events.map((ev, index) =>
      <span key={index}
        title={ev.duration + ' seconds'}
        style={{
          display: 'block',
          float: 'left',
          height: barHeight,
          width: ev.duration * widthRatio,
          backgroundColor:  {
            'warmup': '#2F4F4F',
            'walk': '#006400',
            'run': '#228B22',
            'cooldown': '#2F4F4F'
          }[ev.type]
        }} />
    )}
  </div>

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('app')
);
