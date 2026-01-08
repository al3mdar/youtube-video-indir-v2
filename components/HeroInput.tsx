import React, { useState } from 'react';
import { Search, Youtube, ArrowRight, Link2 } from 'lucide-react';
import { VideoMetadata, DownloadStatus } from '../types';

interface HeroInputProps {
  onUrlSubmit: (url: string) => void;
  status: DownloadStatus;
}

const HeroInput: React.FC<HeroInputProps> = ({ onUrlSubmit, status }) => {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-4 hover:bg-white/10 transition-colors cursor-default">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          v2.0 Yayında • Yapay Zeka Destekli
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Videoları <span className="gradient-text">Sanata</span> <br/> Dönüştür ve İndir.
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
          YouTube videolarını en yüksek kalitede MP4 veya MP3 formatında indirin. 
          Gelişmiş AI analizi ile içerik özetleri alın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
        <div className={`absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl opacity-50 blur transition duration-500 group-hover:opacity-100 ${isFocused ? 'opacity-100' : ''}`} />
        <div className="relative bg-surface rounded-xl p-2 flex items-center gap-3 shadow-2xl ring-1 ring-white/10">
          <div className="pl-4 text-gray-500">
            <Link2 className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="YouTube bağlantısını buraya yapıştırın..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 h-12 text-lg"
          />
          <button 
            type="button" 
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                setUrl(text);
              } catch (err) {
                console.error("Paste failed", err);
              }
            }}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-all hidden sm:block"
          >
            Yapıştır
          </button>
          <button 
            type="submit"
            className="bg-white text-black h-12 px-6 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!url.trim() || status === DownloadStatus.ANALYZING}
          >
            {status === DownloadStatus.ANALYZING ? (
               <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                Başla <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="flex justify-center gap-8 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <Youtube className="w-4 h-4" /> YouTube Destekli
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 4K Ultra HD
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> 320kbps MP3
        </div>
      </div>
    </div>
  );
};

export default HeroInput;
