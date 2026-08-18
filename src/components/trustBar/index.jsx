import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const TrustBar = () => {
  const { trustItems } = useApp();
  const [selectedTrust, setSelectedTrust] = useState(null);

  if (!trustItems || trustItems.length === 0) return null;

  return (
    <section className="px-4 py-2">
      <div className={`bg-[#f0fdf4] border-2 border-[#d4af37]/50 rounded-2xl p-3 shadow-md grid grid-cols-4 gap-2 ${styles.trustGrid}`}>
        {trustItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTrust(item)}
            className="flex flex-col items-center text-center p-1 rounded-xl hover:bg-white/80 transition-all cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#073822] flex items-center justify-center mb-1 text-[#fef08a] shadow-sm border border-[#d4af37]">
              <i className={`${item.iconClass} text-base`} />
            </div>
            <span className="text-[10px] font-black text-[#073822] leading-tight">
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {selectedTrust && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border-2 border-[#d4af37]">
            <div className="flex items-center gap-3 mb-3 border-b border-[#d4af37]/30 pb-3">
              <div className="w-10 h-10 rounded-full bg-[#073822] text-[#fef08a] flex items-center justify-center border border-[#d4af37]">
                <i className={`${selectedTrust.iconClass} text-lg`} />
              </div>
              <h3 className="text-sm font-black text-[#073822]">
                {selectedTrust.title}
              </h3>
            </div>
            <p className="text-xs text-[#1e3a29] leading-relaxed mb-4 text-justify font-medium">
              {selectedTrust.description}
            </p>
            <button
              onClick={() => setSelectedTrust(null)}
              className="w-full bg-[#073822] text-[#fef08a] text-xs font-black py-2.5 rounded-xl transition-colors border border-[#d4af37]"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
