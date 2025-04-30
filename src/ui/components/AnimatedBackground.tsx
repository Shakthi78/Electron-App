import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-500 to-blue-300"
        style={{ opacity: 0.8 }}
      />
      
      <div className="absolute inset-0">
        {/* Wave 1 - Slow moving */}
        <div 
          className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
            filter: 'contrast(120%) brightness(120%)',
          }}
        />
        
        {/* Wave 2 - Medium fast moving */}
        <div 
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-wave-slow opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`,
            backgroundSize: '40% 40%',
            backgroundPosition: 'center',
            transform: 'rotate(0deg)',
          }}
        />
        
        {/* Wave 3 - Fast moving */}
        <div 
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-wave-fast opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
            backgroundSize: '30% 30%',
            backgroundPosition: 'center',
            transform: 'rotate(0deg)',
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;