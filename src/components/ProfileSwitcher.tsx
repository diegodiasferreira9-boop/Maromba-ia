import { UserProfile } from '../types';
import { UserPlus, User, Trash2, Dumbbell } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ProfileSwitcherProps {
  profiles: UserProfile[];
  activeProfileId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export default function ProfileSwitcher({ profiles, activeProfileId, onSelect, onAdd, onDelete }: ProfileSwitcherProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 mb-4">
            <Dumbbell size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase italic">MarombaAI</h1>
          <p className="text-zinc-400 text-sm mt-2">Quem vai treinar hoje?</p>
        </div>

        <div className="space-y-3">
          {profiles.map((profile) => (
            <div key={profile.id} className="group relative">
              <button
                onClick={() => onSelect(profile.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                  activeProfileId === profile.id
                    ? "bg-orange-500/10 border-orange-500 text-orange-500"
                    : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-500 text-zinc-300"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold uppercase italic truncate">{profile.name}</div>
                  <div className="text-xs opacity-60 uppercase tracking-widest">{profile.bodyType}</div>
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(profile.id); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-zinc-700 hover:border-orange-500 hover:text-orange-500 transition-all text-zinc-500 font-bold uppercase italic"
          >
            <UserPlus size={20} />
            Novo Perfil
          </button>
        </div>
      </motion.div>
    </div>
  );
}
