import { UserProfile, WorkoutPlan, Exercise } from '../types';
import { CheckCircle2, Circle, Trophy, RefreshCcw, Info, Dumbbell } from 'lucide-react';
import WorkoutTimer from './WorkoutTimer';
import VoiceGuide from './VoiceGuide';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface DashboardProps {
  profile: UserProfile;
  workout: WorkoutPlan;
  onToggleExercise: (id: string) => void;
  onReset: () => void;
  onRefreshWorkout: () => void;
  isRefreshing: boolean;
}

export default function Dashboard({ 
  profile, 
  workout, 
  onToggleExercise, 
  onReset, 
  onRefreshWorkout,
  isRefreshing 
}: DashboardProps) {
  const completedCount = workout.exercises.filter(ex => ex.completed).length;
  const progress = (completedCount / workout.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-orange-500">
              {workout.title}
            </h1>
            <p className="text-zinc-400 mt-1">
              Foco: <span className="text-zinc-200 font-medium">{profile.goal}</span> • 
              Biotipo: <span className="text-zinc-200 font-medium uppercase">{profile.bodyType}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onRefreshWorkout}
              disabled={isRefreshing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-bold uppercase italic flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Novo Treino
            </button>
            <button 
              onClick={onReset}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-bold uppercase italic transition-colors"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Stats & Timer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WorkoutTimer />
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Progresso do Dia</div>
              <div className="text-xl font-bold text-orange-500">{completedCount}/{workout.exercises.length}</div>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Advice Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-4 items-start"
        >
          <div className="p-2 bg-orange-500 text-white rounded-lg shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h3 className="font-bold uppercase italic text-orange-500 text-sm">Dica da IA</h3>
            <p className="text-zinc-300 text-sm leading-relaxed mt-1">{workout.advice}</p>
          </div>
        </motion.div>

        {/* Exercise List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase italic tracking-wider flex items-center gap-2">
            <Dumbbell size={20} /> Exercícios
          </h2>
          <div className="grid gap-4">
            {workout.exercises.map((exercise, idx) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "bg-zinc-900 border rounded-xl p-4 transition-all duration-300",
                  exercise.completed ? "border-orange-500/50 opacity-60" : "border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn("font-bold text-lg uppercase italic", exercise.completed && "line-through")}>
                        {exercise.name}
                      </h3>
                      <VoiceGuide text={`${exercise.name}. ${exercise.sets} de ${exercise.reps}. Instruções: ${exercise.instructions}`} />
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider text-orange-500 mb-3">
                      <span className="bg-orange-500/10 px-2 py-1 rounded">{exercise.sets}</span>
                      <span className="bg-orange-500/10 px-2 py-1 rounded">{exercise.reps}</span>
                      <span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded">Descanso: {exercise.rest}</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{exercise.instructions}</p>
                  </div>
                  <button 
                    onClick={() => onToggleExercise(exercise.id)}
                    className={cn(
                      "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      exercise.completed ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {exercise.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Finish Celebration */}
        {progress === 100 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border-2 border-orange-500 rounded-2xl p-8 text-center space-y-4"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500 text-white mb-2">
              <Trophy size={40} />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Treino Concluído!</h2>
            <p className="text-zinc-400">Você esmagou o treino de hoje, {profile.name}! Amanhã tem mais.</p>
            <button 
              onClick={onRefreshWorkout}
              className="bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-8 rounded-xl transition-all uppercase italic tracking-widest text-lg"
            >
              Gerar Novo Desafio
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
