import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, connect } from 'react-redux';
import { actions, store } from './common/lib/store';

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
    {workouts.map((workout, index) =>
      <li key={index}>
        <p>{workout.title}</p>
        <WorkoutBar workout={workout} />
      </li>
    )}
  </ul>;

const WorkoutBar = ({ dispatch, workout }) => {
  const totalWidth = 400;
  const totalTime = 2400;
  //const totalTime = workout.events.map(e => e.duration)
  //  .reduce((prev, curr) => prev + curr, 0);
  const widthRatio = totalWidth / totalTime;

  const style = {
    display: 'block',
    width: 600,
    height: 25
  };
  return (
    <div className="workoutBar" style={style}>
      {workout.events.map((event, index) => {
        const segmentStyle = {
          display: 'block',
          float: 'left',
          height: style.height,
          width: event.duration * widthRatio,
          backgroundColor:  {
            'warmup': '#2F4F4F',
            'walk': '#006400',
            'run': '#228B22',
            'cooldown': '#2F4F4F'
          }[event.type],
        }
        const segmentTitle = event.duration + ' seconds';
        return <span key={index} style={segmentStyle} title={segmentTitle}></span>;
      })}
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('app')
);
