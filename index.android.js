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
  View
} from 'react-native';

import { Provider, connect } from 'react-redux';
import store from './common/lib/store';

const App = connect(state => {
  return { workouts: state.workouts };
})(React.createClass({
  render() {
    const { dispatch, workouts } = this.props;
    return (
      <View style={styles.container}>
        {workouts.get('workouts').map((workout, index) =>
          <Text key={index}>{workout.get('title')}</Text>
        )}
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

// The registry expects a component, so let's return a function component
AppRegistry.registerComponent('C25kReact', () => () =>  // (yo dawg)
  <Provider store={store}><App /></Provider>);
