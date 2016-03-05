/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import { Provider, connect } from 'react-redux';
import { actions, store } from './common/lib/store';

import Dimensions from 'Dimensions';

const App = connect(state => {
  return { workouts: state.workouts };
})(React.createClass({
  render() {
    const { dispatch, workouts } = this.props;
    const style = {
      /*
      marginTop: 30,
      marginLeft: 0,
      marginRight: 0,
      */
    };
    return (
      <View style={style}>
        <WorkoutList workouts={workouts} />
      </View>
    );
  }
}));

const WorkoutList = ({ dispatch, workouts }) => {
    const style = {
      marginTop: 30,
      marginLeft: 0,
      marginRight: 0,
    };
  return <ScrollView style={style}>
    {workouts.map((workout, index) =>
      <View key={index}>
        <Text>{workout.title}</Text>
        <WorkoutBar workout={workout} />
      </View>
    )}
  </ScrollView>;
}

const WorkoutBar = ({ dispatch, workout }) => {

  const style = {
    width: Dimensions.get('window').width,
    borderColor: '#000',
    backgroundColor: '#ddd',
    height: 40,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const totalWidth = style.width;
  const totalTime = 2400;
  //const totalTime = workout.events.map(e => e.duration)
  //  .reduce((prev, curr) => prev + curr, 0);
  const widthRatio = totalWidth / totalTime;

  return (
    <View style={style}>{workout.events.map((event, index) => {
      const segmentStyle = {
        height: style.height,
        width: event.duration * widthRatio,
        backgroundColor:  {
          'warmup': '#2F4F4F',
          'walk': '#006400',
          'run': '#228B22',
          'cooldown': '#2F4F4F'
        }[event.type],
      }
      return <View key={index} style={segmentStyle} />;
    })}</View>
  );
};

// The registry expects a component, so let's return a function component
AppRegistry.registerComponent('C25kReact', () => () =>  // (yo dawg)
  <Provider store={store}><App /></Provider>);
