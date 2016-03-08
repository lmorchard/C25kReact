'use strict';
import React, { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './common/lib/store';
import { App } from './common/lib/components-native';

// The registry expects a component, so let's return a function component
AppRegistry.registerComponent('C25kReact', () => () =>  // (yo dawg)
  <Provider store={store}><App /></Provider>);
