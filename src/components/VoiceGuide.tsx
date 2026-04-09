import { Volume2 } from 'lucide-react';

interface VoiceGuideProps {
  text: string;
}

export default function VoiceGuide({ text }: VoiceGuideProps) {
  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button 
      onClick={speak}
      className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
      title="Ouvir instruções"
    >
      <Volume2 size={18} />
    </button>
  );
}
