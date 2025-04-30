// import { Video, Settings, Tablet } from 'lucide-react';
import { Key } from 'react';

interface ButtonProps {
  label: Key, 
  icon: any, 
  onClick: () => void
}

const QuickAction = ({label, icon, onClick}: ButtonProps) => {
  
  return (
      <button
        key={label}
        onClick={onClick}
        className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg w-24 h-24 text-white border border-white/10 transition-all"
      >
        <div className="mb-2">{icon}</div>
        <span className="text-sm">{label}</span>
      </button>
  );
};

export default QuickAction;