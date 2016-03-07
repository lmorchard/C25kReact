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
  TouchableHighlight,
  TouchableOpacity,
  Navigator,
  ScrollView,
  TabBarIOS
} from 'react-native';

var Icon = require('react-native-vector-icons/Ionicons');

import { Provider, connect } from 'react-redux';
import { actions, store, utils } from './common/lib/store';

import Dimensions from 'Dimensions';

const App = connect(state => {
  return {
    state: state,
    workouts: state.workouts
  };
})(React.createClass({
  render() {
    const { dispatch, state, workouts } = this.props;
    const barStyles = { height: 50, backgroundColor: '#ddd' };
    return (
      <Navigator
        initialRoute={{ id: 'home', title: state.title }}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar style={barStyles}
                                   routeMapper={this.routeMapper} />
        } />
    );
  },
  barButtonStyle: { height: 50 },
  routeMapper: {
    LeftButton(route, navigator, index, navState) {
      if (index === 0) { return null; }
      return (
        <TouchableOpacity onPress={() => navigator.pop()}>
          <Text style={this.barButtonStyle}>&lt; Back</Text>
        </TouchableOpacity>
      );
    },
    Title(route, navigator, index, navState) {
      return <Text style={this.barButtonStyle}>{route.title}</Text>;
    },
    RightButton(route, navigator, index, navState) {
      return null;
    }
  },
  renderScene(route, navigator) {
    const { dispatch, state, workouts } = this.props;
    switch (route.id) {
      case 'workout':
        const progress = state.progress[route.workout.id] || 0;
        return <WorkoutView dispatch={dispatch} navigator={navigator}
                            workout={route.workout} progress={progress} />;
      default:
        return <HomeView dispatch={dispatch} navigator={navigator}
                         workouts={workouts} />;
    }
  }
}));

class HomeView extends Component {
  render() {
    const { workouts, navigator } = this.props;
    const style = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    };
    return (
      <View style={style}>
        <WorkoutList navigator={navigator} workouts={workouts} />
      </View>
    );
  }
}

class WorkoutView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      progress: this.props.progress
    };
  }

  render() {
    const { navigator, workout } = this.props;
    const { progress } = this.state;

    const currEventIdx = this.findCurrentEventIndex();
    const currEvent = workout.events[currEventIdx];

    const totalDuration = workout.events
      .reduce((prev, ev) => prev + ev.duration, 0) * 1000;

    // Calculate width of a second with respect to total width of screen.
    const barWidth = Dimensions.get('window').width;
    const widthRatio = barWidth / (totalDuration / 1000);

    const style = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      marginTop: 50,
    };

    return (
      <View style={style}>

        <WorkoutBar workout={workout}
                    barHeight={40} barWidth={barWidth}
                    widthRatio={widthRatio} />

        <Text>{workout.title}</Text>

        <Clock title="Elapsed" time={progress} countdown={false} />
        <Clock title={currEvent.type} time={currEvent.end - progress} countdown={false} />
        <Clock title="Remaining" time={totalDuration - progress} countdown={true} />

        <Text>{this.state.running ? 'Running' : 'Stopped'}</Text>

        <TouchableOpacity onPress={() => this.startTimer()}><Text>Start</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => this.stopTimer()}><Text>Pause</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => this.resetTimer()}><Text>Reset</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => this.prevEvent()}><Text>Prev</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => this.nextEvent()}><Text>Next</Text></TouchableOpacity>

      </View>
    );
  }

  componentDidMount() {
    this.lastTick = Date.now();
    this.timer = setInterval(() => this.tick(), 250);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.stopTimer();
  }

  tick() {
    const { dispatch, workout } = this.props;

    const now = Date.now();
    const delta = now - this.lastTick;
    this.lastTick = now;

    if (this.state.running) {
      const newProgress = this.state.progress + delta;
      const lastEvent = workout.events[workout.events.length - 1];
      if (newProgress >= lastEvent.end) {
        this.setState({running: false});
      }
      this.setProgress(newProgress);
    }
  }

  setProgress(value) {
    const { dispatch, workout } = this.props;
    this.setState({progress: value});
    dispatch(actions.setWorkoutProgress(workout.id, value));
  }

  resetTimer() {
    this.setState({running: false});
    this.setProgress(0);
  }

  startTimer() {
    this.setState({running: true});
  }

  stopTimer() {
    this.setState({running: false});
  }

  prevEvent() {
    const { workout } = this.props;
    const newIdx = this.findCurrentEventIndex() - 1;
    if (newIdx >= 0) {
      this.setProgress(workout.events[newIdx].start);
    }
  }

  nextEvent() {
    const { workout } = this.props;
    const newIdx = this.findCurrentEventIndex() + 1;
    if (newIdx < workout.events.length) {
      this.setProgress(workout.events[newIdx].start);
    }
  }

  findCurrentEventIndex() {
    const { workout } = this.props;
    const { progress } = this.state;
    for (var idx = 0; idx < workout.events.length; idx++) {
      const ev = workout.events[idx];
      if (progress >= ev.start && progress < ev.end) { return idx; }
    }
    return workout.events.length - 1;
  }

  getCurrentRoute(navigator) {
    const { workout } = this.props;
    return navigator.state.routeStack[navigator.state.presentedIndex];
  }

}

class Clock extends Component {
  pad(value, length) {
    var padded = '' + '000' + parseInt(value);
    return padded.substr(padded.length - length);
  }
  render() {
    const { dispatch, title, time, countdown } = this.props;
    const roundedTime = Math[countdown ? 'ceil' : 'floor'](time / 1000);
    const minutes = this.pad(roundedTime / 60, 2);
    const seconds = this.pad(roundedTime - (minutes * 60), 2);
    return (
      <View>
        <Text>{title}</Text>
        <Text>{minutes}:{seconds}</Text>
      </View>
    );
  }
}

const WorkoutList = ({ dispatch, navigator, workouts }) => {
  // Calculate the total duration of the longest workout.
  const maxWorkoutTime = utils.calculateMaxWorkoutTime(workouts);

  // Calculate width of a second with respect to total width of screen.
  const barWidth = Dimensions.get('window').width;
  const widthRatio = barWidth / maxWorkoutTime;

  const style = { marginTop: 60 };
  const itemStyle = { marginTop: 5, marginBottom: 5 };
  const itemTextStyle = { textAlign: 'center', fontSize: 15 };

  return (
    <ScrollView style={style} showsVerticalScrollIndicator={true}>
      {workouts.map((workout, index) =>
        <TouchableHighlight key={index}
            underlayColor="#ddd"
            onPress={() => navigator.push({ id: 'workout',
                                            workout: workout,
                                            title: workout.title }) }>
          <View style={itemStyle}>
            <Text style={itemTextStyle}>{workout.title}</Text>
            <WorkoutBar workout={workout}
                        barHeight={40} barWidth={barWidth}
                        widthRatio={widthRatio} />
          </View>
        </TouchableHighlight>
      )}
    </ScrollView>
  );
}

const WorkoutBar = ({ workout, barHeight, barWidth, widthRatio }) =>
  <View style={{
      width: barWidth,
      height: barHeight,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center' }}>
    {workout.events.map((ev, index) =>
      <View key={index} style={{
        width: Math.floor(ev.duration * widthRatio),
        height: barHeight,
        backgroundColor: {
          'warmup': '#2F4F4F',
          'walk': '#006400',
          'run': '#228B22',
          'cooldown': '#2F4F4F'
        }[ev.type]
      }} />
    )}
  </View>;

// The registry expects a component, so let's return a function component
AppRegistry.registerComponent('C25kReact', () => () =>  // (yo dawg)
  <Provider store={store}><App /></Provider>);
