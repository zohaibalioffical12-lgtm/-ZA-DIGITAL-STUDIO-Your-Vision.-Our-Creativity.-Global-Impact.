import React from 'react';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="w-full py-24 max-w-2xl mx-auto px-4 text-center space-y-6">
      <div className="font-mono text-7xl font-extrabold text-yellow-400">
        404
      </div>
      <h1 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
        The requested digital resource does not exist or has been relocated within the ZA DIGITAL STUDIO directory.
      </p>

      <div className="pt-4 flex justify-center gap-4">
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
        <button
          onClick={() => onNavigate('/services')}
          className="px-5 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded hover:bg-zinc-200 transition-colors"
        >
          View Services
        </button>
      </div>
    </div>
  );
};
