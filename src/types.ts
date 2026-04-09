export type BodyType = 'ectomorph' | 'mesomorph' | 'endomorph';

export interface UserProfile {
  id: string;
  name: string;
  bodyType: BodyType;
  goal: string;
  limitations: string;
  workoutPlan?: WorkoutPlan;
}

export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  instructions: string;
  completed: boolean;
}

export interface WorkoutPlan {
  day: string;
  title: string;
  exercises: Exercise[];
  advice: string;
}
