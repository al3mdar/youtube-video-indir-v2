import React, { useState, useEffect } from 'react';
import { Download, Play, Music2, Film, Sparkles, CheckCircle2, Loader2, Copy } from 'lucide-react';
import { VideoMetadata, MediaType, DownloadStatus, AITagResponse } from '../types';
import { generateAIAnalysis } from '../services/geminiService';

interface ResultCardProps {
  metadata: VideoMetadata;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ metadata, onReset }) => {
  const [selectedType, setSelectedType] = useState<MediaType>(MediaType.VIDEO);
  const [status, setStatus] = useState<DownloadStatus>(DownloadStatus.READY);
  const [progress, setProgress] = useState(0);
  const [aiData, setAiData] = useState<AITagResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Simulate AI Analysis on mount or when requested
  const handleAIAnalysis = async () => {
    setIsAiLoading(true);
    try {
      // Simulating a title since we might only have ID from client-side regex
      // In a real app, this title would come from the backend metadata fetch
      const titleToAnalyze = metadata.title || "Unknown Amazing Video"; 
      const data = await generateAIAnalysis(titleToAnalyze);
      setAiData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDownload = () => {
    setStatus(DownloadStatus.DOWNLOADING);
    setProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus(DownloadStatus.COMPLETED);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass-panel rounded-3xl p-6 md:p-8 grid md:grid-cols-2 gap-8 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Left: Thumbnail & Visuals */}
        <div className="space-y-6">
          <div className="relative group rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/10">
            <img 
              src={metadata.thumbnail} 
              alt="Thumbnail" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-12 h-12 text-white fill-white/20" />
            </div>
            <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-mono">
              {metadata.duration}
            </div>
          </div>

          {!aiData && !isAiLoading && (
            <button 
              onClick={handleAIAnalysis}
              className="w-full py-3 rounded-xl border border-dashed border-secondary/50 text-secondary hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Yapay Zeka ile Analiz Et
            </button>
          )}

          {isAiLoading && (
            <div className="w-full py-4 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              Gemini içeriği inceliyor...
            </div>
          )}

          {aiData && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Gemini Analizi
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {aiData.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {aiData.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between group cursor-pointer" onClick={() => navigator.clipboard.writeText(aiData.suggestedFilename)}>
                <div className="text-xs text-gray-500">Önerilen Dosya Adı:</div>
                <div className="text-xs text-gray-300 font-mono flex items-center gap-1 group-hover:text-primary transition-colors">
                  {aiData.suggestedFilename}.{selectedType === MediaType.VIDEO ? 'mp4' : 'mp3'}
                  <Copy className="w-3 h-3" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold leading-tight text-white line-clamp-2">
              {metadata.title || "YouTube Video ID: " + metadata.id}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium">HD</span>
              <span>•</span>
              <span>YouTube</span>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* Type Selector */}
            <div className="bg-black/40 p-1.5 rounded-xl flex relative">
              <div 
                className={`absolute inset-y-1.5 w-1/2 bg-white/10 rounded-lg shadow-sm transition-all duration-300 ease-out ${selectedType === MediaType.AUDIO ? 'translate-x-full' : 'translate-x-0'}`}
              />
              <button
                onClick={() => setSelectedType(MediaType.VIDEO)}
                className={`relative flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors z-10 ${selectedType === MediaType.VIDEO ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Film className="w-4 h-4" /> Video (MP4)
              </button>
              <button
                onClick={() => setSelectedType(MediaType.AUDIO)}
                className={`relative flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors z-10 ${selectedType === MediaType.AUDIO ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Music2 className="w-4 h-4" /> Ses (MP3)
              </button>
            </div>

            {/* Quality Options (Visual Only for Demo) */}
            <div className="grid grid-cols-3 gap-3">
               {['1080p', '720p', '480p'].map((q) => (
                 <button 
                  key={q} 
                  disabled={selectedType === MediaType.AUDIO}
                  className={`py-2 rounded-lg text-xs font-medium border transition-all ${selectedType === MediaType.AUDIO ? 'opacity-30 border-white/5' : 'border-white/10 hover:bg-white/5 hover:border-primary/50 text-gray-400'}`}
                >
                  {q}
                 </button>
               ))}
            </div>

            {/* Action Button */}
            {status === DownloadStatus.DOWNLOADING ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Dönüştürülüyor...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : status === DownloadStatus.COMPLETED ? (
               <button 
                className="w-full py-4 rounded-xl bg-green-500/20 text-green-400 border border-green-500/50 flex items-center justify-center gap-2 font-semibold hover:bg-green-500/30 transition-all"
                onClick={onReset}
              >
                <CheckCircle2 className="w-5 h-5" />
                İndirme Tamamlandı
              </button>
            ) : (
              <button 
                onClick={handleDownload}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary via-accent to-secondary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                Hemen İndir
              </button>
            )}
            
            <button onClick={onReset} className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors">
              Farklı bir video ara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
