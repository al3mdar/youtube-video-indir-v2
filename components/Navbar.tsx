import React from 'react';
import { Zap, Music, Video, Github } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center z-50 relative">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          NeonStream
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
          <Video className="w-4 h-4" /> Video İndir
        </a>
        <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
          <Music className="w-4 h-4" /> MP3 Dönüştür
        </a>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:block px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-medium text-white/80">
          Giriş Yap
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Github className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
