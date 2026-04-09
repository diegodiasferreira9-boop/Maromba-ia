import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WorkoutPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateWorkout(profile: UserProfile): Promise<WorkoutPlan> {
  const prompt = `
    Generate a personalized home workout plan for a user with the following profile:
    - Name: ${profile.name}
    - Body Type: ${profile.bodyType}
    - Goal: ${profile.goal}
    - Physical Limitations: ${profile.limitations || "None"}

    The plan should be for "Today's Workout". 
    Provide a title for the workout, a list of 5-7 exercises suitable for home (no gym equipment required, or using common household items), and a piece of motivational advice.
    
    For each exercise, include:
    - Name
    - Sets (e.g., "3 sets")
    - Reps (e.g., "12-15 reps" or "45 seconds")
    - Rest period (e.g., "60 seconds")
    - Brief instructions
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          day: { type: Type.STRING },
          advice: { type: Type.STRING },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                sets: { type: Type.STRING },
                reps: { type: Type.STRING },
                rest: { type: Type.STRING },
                instructions: { type: Type.STRING },
              },
              required: ["id", "name", "sets", "reps", "rest", "instructions"],
            },
          },
        },
        required: ["title", "day", "advice", "exercises"],
      },
    },
  });

  const plan = JSON.parse(response.text) as WorkoutPlan;
  // Ensure exercises have completed: false
  plan.exercises = plan.exercises.map(ex => ({ ...ex, completed: false }));
  return plan;
}
