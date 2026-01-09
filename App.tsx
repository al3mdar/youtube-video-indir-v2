import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import HeroInput from './components/HeroInput';
import ResultCard from './components/ResultCard';
import { DownloadStatus, VideoMetadata } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<DownloadStatus>(DownloadStatus.IDLE);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const extractVideoID = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleUrlSubmit = async (url: string) => {
    setStatus(DownloadStatus.ANALYZING);

    try {
      const formData = new FormData();
      formData.append('url', url);

      const response = await fetch('api/metadata.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setMetadata({
          id: data.id,
          url: url,
          title: data.title,
          thumbnail: data.thumbnail,
          duration: data.duration
        });
        setStatus(DownloadStatus.READY);
      } else {
        alert("Hata: " + (data.error || "Video bilgileri alınamadı."));
        setStatus(DownloadStatus.IDLE);
      }
    } catch (error) {
      console.error("Metadata fetch error:", error);
      alert("Bağlantı hatası: Sunucuya ulaşılamadı.");
      setStatus(DownloadStatus.IDLE);
    }
  };

  const handleReset = () => {
    setStatus(DownloadStatus.IDLE);
    setMetadata(null);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <Background />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {status === DownloadStatus.IDLE || status === DownloadStatus.ANALYZING ? (
          <HeroInput onUrlSubmit={handleUrlSubmit} status={status} />
        ) : metadata ? (
          <ResultCard metadata={metadata} onReset={handleReset} />
        ) : null}
      </main>

      <footer className="w-full py-8 text-center text-muted text-xs z-10 glass border-t border-main mt-auto animate-entrance" style={{ animationDelay: '0.8s' }}>
        <p>© 2024 NeonStream. Tüm hakları saklıdır. Gelişmiş AI ve Ultra HD İndirme Çözümü.</p>
        <div className="mt-2 flex justify-center gap-6 font-bold">
          <a href="#" className="hover:text-primary transition-colors">Gizlilik</a>
          <a href="#" className="hover:text-secondary transition-colors">Kullanım Şartları</a>
          <a href="#" className="hover:text-accent transition-colors">İletişim</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
