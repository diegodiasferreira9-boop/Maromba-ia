import React, { useState } from 'react';
import { UserProfile, BodyType } from '../types';
import { cn } from '../lib/utils';
import { Dumbbell, Target, AlertCircle, User } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: (profile: Omit<UserProfile, 'id'>) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Omit<UserProfile, 'id'>>({
    name: '',
    bodyType: 'mesomorph',
    goal: '',
    limitations: '',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  const bodyTypes: { type: BodyType; label: string; desc: string }[] = [
    { type: 'ectomorph', label: 'Ectomorfo', desc: 'Dificuldade em ganhar peso e músculos. Estrutura magra.' },
    { type: 'mesomorph', label: 'Mesomorfo', desc: 'Facilidade em ganhar músculos e perder gordura. Estrutura atlética.' },
    { type: 'endomorph', label: 'Endomorfo', desc: 'Facilidade em ganhar peso. Estrutura mais larga e robusta.' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 mb-4">
            <Dumbbell size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase italic">MarombaAI</h1>
          <p className="text-zinc-400 text-sm mt-2">Seu treino personalizado começa aqui.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Qual seu nome?
                </span>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="Ex: David"
                />
              </label>
              <button
                type="button"
                onClick={nextStep}
                disabled={!profile.name}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors uppercase italic tracking-widest"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Qual seu biotipo?</span>
              <div className="grid gap-3">
                {bodyTypes.map(bt => (
                  <button
                    key={bt.type}
                    type="button"
                    onClick={() => setProfile({ ...profile, bodyType: bt.type })}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-all",
                      profile.bodyType === bt.type 
                        ? "bg-orange-500/10 border-orange-500 text-orange-500" 
                        : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-500 text-zinc-300"
                    )}
                  >
                    <div className="font-bold uppercase italic">{bt.label}</div>
                    <div className="text-xs opacity-70 mt-1">{bt.desc}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={prevStep} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors uppercase italic">Voltar</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors uppercase italic">Próximo</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Target size={14} /> Qual seu objetivo?
                </span>
                <textarea
                  required
                  value={profile.goal}
                  onChange={e => setProfile({ ...profile, goal: e.target.value })}
                  className="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-[100px]"
                  placeholder="Ex: Ganhar massa muscular, perder gordura abdominal..."
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={14} /> Alguma limitação física?
                </span>
                <input
                  type="text"
                  value={profile.limitations}
                  onChange={e => setProfile({ ...profile, limitations: e.target.value })}
                  className="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="Ex: Dor no joelho, problema na coluna (opcional)"
                />
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={prevStep} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors uppercase italic">Voltar</button>
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors uppercase italic">Gerar Treino</button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
