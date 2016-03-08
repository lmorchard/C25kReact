import { actions, store, utils } from './store';

export const WorkoutTimerMixin = {

  componentDidMount() {
    this.lastTick = Date.now();
    this.timer = setInterval(() => this.tick(), 250);
  },

  componentWillUnmount() {
    clearInterval(this.timer);
    this.stopTimer();
  },

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
  },

  setProgress(value) {
    const { dispatch, workout } = this.props;
    this.setState({progress: value});
    dispatch(actions.setWorkoutProgress(workout.id, value));
  },

  resetTimer() {
    this.setState({running: false});
    this.setProgress(0);
  },

  startTimer() {
    this.setState({running: true});
  },

  stopTimer() {
    this.setState({running: false});
  },

  prevEvent() {
    const { workout } = this.props;
    const newIdx = this.findCurrentEventIndex() - 1;
    if (newIdx >= 0) {
      this.setProgress(workout.events[newIdx].start);
    }
  },

  nextEvent() {
    const { workout } = this.props;
    const newIdx = this.findCurrentEventIndex() + 1;
    if (newIdx < workout.events.length) {
      this.setProgress(workout.events[newIdx].start);
    }
  },

  findCurrentEventIndex() {
    const { workout } = this.props;
    const { progress } = this.state;
    for (var idx = 0; idx < workout.events.length; idx++) {
      const ev = workout.events[idx];
      if (progress >= ev.start && progress < ev.end) { return idx; }
    }
    return workout.events.length - 1;
  },

  getCurrentRoute(navigator) {
    const { workout } = this.props;
    return navigator.state.routeStack[navigator.state.presentedIndex];
  }

}
