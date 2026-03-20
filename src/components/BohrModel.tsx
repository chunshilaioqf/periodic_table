import React from 'react';

interface BohrModelProps {
  atomicNumber: number;
  symbol: string;
}

export const BohrModel: React.FC<BohrModelProps> = ({ atomicNumber, symbol }) => {
  // Calculate electron shells
  const getShells = (n: number) => {
    const shells = [];
    let remaining = n;
    const capacities = [2, 8, 18, 32, 32, 18, 8];
    
    for (const cap of capacities) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, cap);
      shells.push(count);
      remaining -= count;
    }
    return shells;
  };

  const shells = getShells(atomicNumber);
  const size = 300;
  const center = size / 2;
  const baseRadius = 30;
  const shellSpacing = 25;

  return (
    <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-3xl p-6 backdrop-blur-md border border-white/10 shadow-2xl">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-glow">
        {/* Nucleus */}
        <circle cx={center} cy={center} r={15} className="fill-blue-500 animate-pulse" />
        <text 
          x={center} 
          y={center + 5} 
          textAnchor="middle" 
          className="fill-white text-[10px] font-bold font-mono"
        >
          {symbol}
        </text>

        {/* Shells and Electrons */}
        {shells.map((count, shellIndex) => {
          const radius = baseRadius + (shellIndex * shellSpacing);
          return (
            <g key={shellIndex}>
              {/* Shell Orbit */}
              <circle 
                cx={center} 
                cy={center} 
                r={radius} 
                fill="none" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="1" 
                strokeDasharray="4 2"
              />
              
              {/* Electrons */}
              {[...Array(count)].map((_, electronIndex) => {
                const angle = (electronIndex / count) * 2 * Math.PI;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                
                return (
                  <circle 
                    key={electronIndex}
                    cx={x} 
                    cy={y} 
                    r={3} 
                    className="fill-yellow-400 shadow-glow"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${center} ${center}`}
                      to={`360 ${center} ${center}`}
                      dur={`${10 + shellIndex * 5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                );
              })}
            </g>
          );
        })}
      </svg>
      <div className="mt-4 flex gap-4 text-[10px] font-mono uppercase tracking-widest text-blue-300 opacity-70">
        <span>Electrons: {atomicNumber}</span>
        <span>Shells: {shells.length}</span>
      </div>
    </div>
  );
};
