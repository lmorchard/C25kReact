'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Navigator,
  ScrollView
} from 'react-native';

import Dimensions from 'Dimensions';

var Icon = require('react-native-vector-icons/Ionicons');

import { Provider, connect } from 'react-redux';
import { actions, store, utils } from './store';
import { WorkoutTimerMixin } from './mixins';

export const AppView = React.createClass({
  render() {
    const { dispatch, state, workouts } = this.props;
    const barStyles = { height: 50, backgroundColor: '#ddd' };
    return (
      <Navigator
        initialRoute={{ id: 'home', title: state.title }}
        renderScene={(route, navigator) => this.renderScene(route, navigator)}
        onWillFocus={(route) => this.onWillFocus(route)}
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
  onWillFocus(route) {
    if (this.currentWorkoutViewRef) {
      this.currentWorkoutViewRef.stopTimer();
    }
  },
  renderScene(route, navigator) {
    const { dispatch, state, workouts } = this.props;
    switch (route.id) {
      case 'workout':
        const progress = state.progress[route.workout.id] || 0;
        return <WorkoutView dispatch={dispatch} navigator={navigator}
                            workout={route.workout} progress={progress}
                            ref={c => this.currentWorkoutViewRef = c} />;
      default:
        return <HomeView dispatch={dispatch} navigator={navigator}
                         workouts={workouts} />;
    }
  }
});

export const App = connect(state => {
  return {
    state: state,
    workouts: state.workouts
  };
})(AppView);

export class HomeView extends Component {
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

export const WorkoutView = React.createClass({
  mixins: [WorkoutTimerMixin],

  getInitialState() {
    return {
      running: false,
      progress: this.props.progress
    };
  },

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
      flex: 1,
      flexDirection: 'column',
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const eventTitles = {
      'warmup': 'Warm Up',
      'walk': 'Walking',
      'run': 'Running',
      'cooldown': 'Cool Down'
    };

    return (
      <View style={style}>

        <WorkoutBar workout={workout} currEventIdx={currEventIdx}
                    barHeight={80} barWidth={barWidth}
                    widthRatio={widthRatio} />

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center',
                       justifyContent: 'space-around' }}>
          <Clock title="Elapsed" countdown={false} time={progress} fontSize="15" />
          <View style={{
              backgroundColor: this.state.running ? '#99ff99' : '#ff9999'
            }}>
            <Clock title={eventTitles[currEvent.type]} countdown={false}
                   time={currEvent.end - progress} fontSize="25" />
          </View>
          <Clock title="Remaining" countdown={true}
                 time={totalDuration - progress} fontSize="15" />
        </View>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center',
                       justifyContent: 'space-around' }}>
          <Icon.Button size={30} name="skip-backward" onPress={() => this.prevEvent()}></Icon.Button>
          { this.state.running ?
            <Icon.Button size={30} name="pause" onPress={() => this.stopTimer()}></Icon.Button> :
            <Icon.Button size={30} name="ios-play" onPress={() => this.startTimer()}></Icon.Button> }
          <Icon.Button size={30} name="refresh" onPress={() => this.resetTimer()}></Icon.Button>
          <Icon.Button size={30} name="skip-forward" onPress={() => this.nextEvent()}></Icon.Button>
        </View>

      </View>
    );
  }

});

export const WorkoutList = ({ dispatch, navigator, workouts }) => {
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

export const Clock = ({ dispatch, title, time, countdown, fontSize }) => {
  function pad(value, length) {
    var padded = '' + '000' + parseInt(value);
    return padded.substr(padded.length - length);
  }
  const roundedTime = Math[countdown ? 'ceil' : 'floor'](time / 1000);
  const minutes = pad(roundedTime / 60, 2);
  const seconds = pad(roundedTime - (minutes * 60), 2);
  return (
    <View style={{ width: 140, flex: 1, flexDirection:'column', alignItems:'center', padding: 5 }}>
      <Text style={{ textAlign: "center", fontSize: parseInt(fontSize) }}>{title}</Text>
      <Text style={{ textAlign: "center", fontSize: parseInt(fontSize) }}>{minutes}:{seconds}</Text>
    </View>
  );
};

export const WorkoutBar = ({ workout, barHeight, barWidth, widthRatio, currEventIdx }) =>
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
        height:  (currEventIdx === index) ? barHeight * 1.25 : barHeight,
        opacity: (currEventIdx === index) ? 0.5 : 1.0,
        backgroundColor: {
          'warmup': '#2F4F4F',
          'walk': '#006400',
          'run': '#228B22',
          'cooldown': '#2F4F4F'
        }[ev.type]
      }} />
    )}
  </View>;
