import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import HeroInput from './components/HeroInput';
import ResultCard from './components/ResultCard';
import { DownloadStatus, VideoMetadata } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<DownloadStatus>(DownloadStatus.IDLE);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);

  const extractVideoID = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleUrlSubmit = (url: string) => {
    setStatus(DownloadStatus.ANALYZING);
    
    // Simulate network delay for "analyzing"
    setTimeout(() => {
      const id = extractVideoID(url);
      
      if (id) {
        setMetadata({
          id: id,
          url: url,
          title: `YouTube Video ${id} (Demo Title)`, // In a real app, backend fetches title
          thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
          duration: "10:24" // Mock duration
        });
        setStatus(DownloadStatus.READY);
      } else {
        alert("Geçersiz YouTube URL'si. Lütfen tekrar deneyin.");
        setStatus(DownloadStatus.IDLE);
      }
    }, 1500);
  };

  const handleReset = () => {
    setStatus(DownloadStatus.IDLE);
    setMetadata(null);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <Background />
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {status === DownloadStatus.IDLE || status === DownloadStatus.ANALYZING ? (
          <HeroInput onUrlSubmit={handleUrlSubmit} status={status} />
        ) : metadata ? (
          <ResultCard metadata={metadata} onReset={handleReset} />
        ) : null}
      </main>

      <footer className="w-full py-8 text-center text-gray-600 text-xs z-10">
        <p>© 2024 NeonStream. Tüm hakları saklıdır. Bu bir demo çalışmasıdır.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:text-gray-400">Gizlilik</a>
          <a href="#" className="hover:text-gray-400">Kullanım Şartları</a>
          <a href="#" className="hover:text-gray-400">İletişim</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
