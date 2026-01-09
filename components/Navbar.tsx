import React from 'react';
import { Zap, Music, Video, Github, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  return (
    <nav className="w-full py-8 px-6 md:px-16 flex justify-between items-center z-50 relative animate-entrance" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 cursor-pointer group">
        <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-500">
          <Zap className="w-6 h-6 text-white fill-white" />
        </div>
        <span className="text-[22px] font-black tracking-tighter text-white">
          NeonStream
        </span>
      </div>

      <div className="hidden md:flex items-center gap-10 text-[14px] font-bold text-[#888]">
        <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
          <Video className="w-4 h-4" /> Video İndir
        </a>
        <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
          <Music className="w-4 h-4" /> MP3 Dönüştür
        </a>
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={toggleTheme}
          className="text-[#888] hover:text-white transition-colors"
          title={theme === 'light' ? 'Koyu Tema' : 'Açık Tema'}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[13px] font-bold text-white">
          Giriş Yap
        </button>

        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-white transition-colors">
          <Github className="w-5 h-5" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
