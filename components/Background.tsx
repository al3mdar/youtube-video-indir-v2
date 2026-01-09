import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-main transition-colors duration-700">
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-primary animate-blob" style={{ opacity: 'var(--blob-opacity)' }} />
      <div className="absolute top-[20%] right-[-15%] w-[500px] h-[500px] bg-secondary animate-blob" style={{ opacity: 'var(--blob-opacity)', animationDelay: '-5s' }} />
      <div className="absolute bottom-[-20%] left-[10%] w-[700px] h-[700px] bg-accent animate-blob" style={{ opacity: 'calc(var(--blob-opacity) * 0.8)', animationDelay: '-10s' }} />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
};

export default Background;
