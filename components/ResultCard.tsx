import React, { useState } from 'react';
import {
  Download,
  Settings2,
  Sparkles,
  ChevronRight,
  Clock,
  Eye,
  User,
  CheckCircle2,
  FileVideo,
  Music4,
  RotateCcw,
  Share2
} from 'lucide-react';
import { VideoMetadata, DownloadStatus, AITagResponse } from '../types';
import { generateAIAnalysis } from '../services/geminiService';

interface ResultCardProps {
  metadata: VideoMetadata;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ metadata, onReset }) => {
  const [format, setFormat] = useState<'video' | 'audio'>('video');
  const [status, setStatus] = useState<DownloadStatus>(DownloadStatus.READY);
  const [progress, setProgress] = useState(0);
  const [aiData, setAiData] = useState<AITagResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await generateAIAnalysis(metadata.title);
      if (result) setAiData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    setStatus(DownloadStatus.DOWNLOADING);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 45) {
          clearInterval(interval);
          return 45;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append('url', metadata.url);
      formData.append('format', format);

      const response = await fetch('api/download.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.success) {
        setProgress(100);
        setStatus(DownloadStatus.COMPLETED);
        setTimeout(() => {
          window.location.href = data.downloadUrl;
        }, 500);
      } else {
        alert("Hata: " + (data.error || "İndirme başarısız."));
        setStatus(DownloadStatus.READY);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Bağlantı hatası: Sunucuya ulaşılamadı.");
      setStatus(DownloadStatus.READY);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-entrance">
      {/* Left Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="relative group rounded-[32px] overflow-hidden glass border-main shadow-2xl">
          <img
            src={metadata.thumbnail}
            alt={metadata.title}
            className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="px-4 py-1.5 rounded-xl glass border-white/20 text-white font-bold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" /> {metadata.duration}
            </div>
          </div>

          {status === DownloadStatus.DOWNLOADING && (
            <div className="absolute inset-0 glass backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
              <div className="relative w-24 h-24 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - progress / 100)} className="text-primary transition-all duration-300" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">
                  %{Math.round(progress)}
                </div>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Hazırlanıyor...</h3>
              <p className="text-white/60 text-sm font-medium">Format dönüştürülüyor.</p>
            </div>
          )}

          {status === DownloadStatus.COMPLETED && (
            <div className="absolute inset-0 glass backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/40 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Tamamlandı!</h3>
              <button onClick={onReset} className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors">
                <RotateCcw className="w-5 h-5" /> Başka bir video
              </button>
            </div>
          )}
        </div>

        <div className="glass p-8 rounded-[32px] border-main space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-main line-clamp-2 leading-tight">
              {metadata.title}
            </h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setFormat('video')}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 border-2 ${format === 'video' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-surface border-main hover:border-muted'
                }`}
            >
              <FileVideo className={`w-8 h-8 ${format === 'video' ? 'text-primary' : 'text-muted'}`} />
              <div className="text-center">
                <div className={`font-black text-xs ${format === 'video' ? 'text-main' : 'text-muted'}`}>VIDEO</div>
                <div className="text-[10px] text-muted font-bold">4K MP4</div>
              </div>
            </button>
            <button
              onClick={() => setFormat('audio')}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 border-2 ${format === 'audio' ? 'bg-secondary/10 border-secondary shadow-lg shadow-secondary/10' : 'bg-surface border-main hover:border-muted'
                }`}
            >
              <Music4 className={`w-8 h-8 ${format === 'audio' ? 'text-secondary' : 'text-muted'}`} />
              <div className="text-center">
                <div className={`font-black text-xs ${format === 'audio' ? 'text-main' : 'text-muted'}`}>SES</div>
                <div className="text-[10px] text-muted font-bold">320kbps MP3</div>
              </div>
            </button>
          </div>

          <button
            disabled={status === DownloadStatus.DOWNLOADING}
            onClick={handleDownload}
            className="w-full btn-primary h-16 flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            <span className="text-lg font-black">Hemen İndir</span>
          </button>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass p-10 rounded-[40px] border-main relative overflow-hidden group">
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 p-3 rounded-2xl border border-secondary/30">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-main leading-tight">AI Akıllı Analiz</h3>
                  <p className="text-sm text-muted font-bold">Gemini Pro Destekli</p>
                </div>
              </div>

              {!aiData && !isAnalyzing && (
                <button
                  onClick={handleAIAnalysis}
                  className="px-6 py-3 rounded-2xl bg-surface border border-main hover:border-secondary text-sm font-bold text-main transition-all flex items-center gap-2"
                >
                  Analizi Başlat <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {isAnalyzing ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                <p className="text-xl font-black text-main animate-pulse">Video İnceleniyor...</p>
              </div>
            ) : aiData ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                    <Settings2 className="w-4 h-4" /> Video Özeti
                  </h4>
                  <div className="bg-surface-elevated/50 p-6 rounded-3xl border border-main leading-relaxed text-main font-medium italic">
                    "{aiData.summary}"
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> SEO Etiketleri
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {aiData.tags.map((tag, i) => (
                      <span key={i} className="tag-badge">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Önerilen Dosya Adı
                  </h4>
                  <div className="p-4 bg-main/50 rounded-2xl border border-dashed border-main truncate font-bold text-muted text-sm">
                    {aiData.suggestedFilename}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 border-2 border-dashed border-main rounded-[32px] bg-main/5">
                <Sparkles className="w-12 h-12 text-muted mx-auto opacity-20" />
                <p className="text-muted font-bold">Video içeriği hakkında bilgi almak için <br />analizi başlatın.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
