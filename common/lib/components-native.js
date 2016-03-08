'use strict';
import React, {
  TouchableHighlight,
  ScrollView,
  Text,
  View
} from 'react-native';
import Dimensions from 'Dimensions';

import { actions, store, utils } from './store';

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
