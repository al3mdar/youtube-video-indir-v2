import React, { useState } from 'react';
import { ArrowRight, Link2 } from 'lucide-react';
import { DownloadStatus } from '../types';

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
    <div className="w-full max-w-4xl mx-auto text-center space-y-10 animate-entrance">
      <div className="space-y-6">
        <div className="inline-flex items-center">
          <div className="v2-tag flex items-center">
            <span className="v2-dot"></span>
            v2.0 Yayında • Yapay Zeka Destekli
          </div>
        </div>

        <h1 className="text-[64px] md:text-[80px] font-black tracking-tighter text-white leading-[0.95] drop-shadow-2xl">
          Videoları <span className="gradient-text-sanata">Sanata</span> <br />
          Dönüştür ve İndir.
        </h1>

        <p className="text-[16px] md:text-[18px] text-[#888] max-w-2xl mx-auto leading-relaxed font-medium">
          YouTube videolarını en yüksek kalitede MP4 veya MP3 formatında <br className="hidden md:block" />
          indirin. Gelişmiş AI analizi ile içerik özetleri alın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group max-w-[700px] mx-auto pt-4">
        <div className="premium-input-container flex items-center gap-4 bg-[#0A0A0A]">
          <div className="pl-4 text-[#555]">
            <Link2 className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="YouTube bağlantısını buraya yapıştırın..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-[#444] h-14 text-[16px] font-medium"
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
            className="btn-yapistir"
          >
            Yapıştır
          </button>

          <button
            type="submit"
            className="btn-basla flex items-center gap-2 disabled:opacity-50"
            disabled={!url.trim() || status === DownloadStatus.ANALYZING}
          >
            {status === DownloadStatus.ANALYZING ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Başla</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap justify-center gap-10 pt-12 text-[13px] font-bold text-[#555]">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-[#555]" /> YouTube Destekli
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-[#555]" /> 4K Ultra HD
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-[#555]" /> 320kbps MP3
        </div>
      </div>
    </div>
  );
};

export default HeroInput;
