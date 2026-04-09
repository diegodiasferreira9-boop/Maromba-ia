/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ProfileSwitcher from './components/ProfileSwitcher';
import { UserProfile, WorkoutPlan } from './types';
import { generateWorkout } from './services/gemini';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('maromba_profiles');
    const savedActiveId = localStorage.getItem('maromba_active_id');
    
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
    if (savedActiveId) {
      setActiveProfileId(savedActiveId);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('maromba_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('maromba_active_id', activeProfileId);
    } else {
      localStorage.removeItem('maromba_active_id');
    }
  }, [activeProfileId]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const handleOnboardingComplete = async (newProfileData: Omit<UserProfile, 'id'>) => {
    const newProfile: UserProfile = {
      ...newProfileData,
      id: crypto.randomUUID(),
    };
    
    setLoading(true);
    try {
      const plan = await generateWorkout(newProfile);
      newProfile.workoutPlan = plan;
      setProfiles(prev => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
      setIsAddingProfile(false);
    } catch (error) {
      console.error("Failed to generate workout:", error);
      alert("Erro ao gerar treino. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExercise = (exerciseId: string) => {
    if (!activeProfile || !activeProfile.workoutPlan) return;
    
    const updatedProfiles = profiles.map(p => {
      if (p.id === activeProfileId && p.workoutPlan) {
        const newExercises = p.workoutPlan.exercises.map(ex => 
          ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
        );
        return { ...p, workoutPlan: { ...p.workoutPlan, exercises: newExercises } };
      }
      return p;
    });
    
    setProfiles(updatedProfiles);
  };

  const handleRefreshWorkout = async () => {
    if (!activeProfile) return;
    setLoading(true);
    try {
      const plan = await generateWorkout(activeProfile);
      const updatedProfiles = profiles.map(p => 
        p.id === activeProfileId ? { ...p, workoutPlan: plan } : p
      );
      setProfiles(updatedProfiles);
    } catch (error) {
      console.error("Failed to refresh workout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = (id: string) => {
    if (window.confirm("Deseja realmente excluir este perfil?")) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (activeProfileId === id) {
        setActiveProfileId(null);
      }
    }
  };

  const handleSwitchProfile = () => {
    setActiveProfileId(null);
    setIsAddingProfile(false);
  };

  if (!isInitialized) return null;

  if (loading && (!activeProfile || !activeProfile.workoutPlan)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 p-4 text-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Montando seu treino...</h2>
        <p className="text-zinc-400 mt-2">Nossa IA está analisando seu biotipo e objetivos para criar a rotina perfeita.</p>
      </div>
    );
  }

  if (isAddingProfile || (profiles.length === 0 && !loading)) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!activeProfileId) {
    return (
      <ProfileSwitcher 
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelect={setActiveProfileId}
        onAdd={() => setIsAddingProfile(true)}
        onDelete={handleDeleteProfile}
      />
    );
  }

  if (activeProfile && activeProfile.workoutPlan) {
    return (
      <Dashboard 
        profile={activeProfile} 
        workout={activeProfile.workoutPlan} 
        onToggleExercise={handleToggleExercise}
        onReset={handleSwitchProfile}
        onRefreshWorkout={handleRefreshWorkout}
        isRefreshing={loading}
      />
    );
  }

  return null;
}

