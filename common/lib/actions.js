export const SET_WORKOUT_PROGRESS = 'SET_WORKOUT_PROGRESS';
export function setWorkoutProgress(workoutId, time) {
  return { type: SET_WORKOUT_PROGRESS, workoutId, time };
}
