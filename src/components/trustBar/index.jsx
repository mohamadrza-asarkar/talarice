import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const TrustBar = () => {
  const { trustItems } = useApp();
  const [selectedTrust, setSelectedTrust] = useState(null);

  if (!trustItems || trustItems.length === 0) return null;

  return (
    <section className="px-4 mb-5">
      <div className={`bg-gradient-to-r from-[#f0fdf4] via-[#fefce8] to-[#f0fdf4] border-2 border-[#d4af37]/40 rounded-2xl p-3 shadow-sm grid grid-cols-4 gap-2 ${styles.trustGrid}`}>
        {trustItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTrust(item)}
            className="flex flex-col items-center text-center group hover:bg-white p-1.5 rounded-xl transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#073b27] to-[#136f46] flex items-center justify-center mb-1 text-[#fef08a] group-hover:text-[#d4af37] shadow-md transition-colors border border-[#d4af37]">
              <i className={`${item.iconClass} text-base`} />
            </div>
            <span className="text-[11px] font-black text-[#073b27] leading-tight group-hover:text-[#136f46]">
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {selectedTrust && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border-2 border-[#d4af37]">
            <div className="flex items-center gap-3 mb-3 border-b border-[#d4af37]/30 pb-3">
              <div className="w-10 h-10 rounded-full bg-[#073b27] text-[#fef08a] flex items-center justify-center border border-[#d4af37]">
                <i className={`${selectedTrust.iconClass} text-lg`} />
              </div>
              <h3 className="text-base font-black text-[#073b27]">
                {selectedTrust.title}
              </h3>
            </div>
            <p className="text-xs text-[#1e3a29] leading-relaxed mb-4 text-justify font-medium">
              {selectedTrust.description}
            </p>
            <button
              onClick={() => setSelectedTrust(null)}
              className="w-full bg-[#073b27] text-[#fef08a] text-xs font-black py-2.5 rounded-xl hover:bg-[#136f46] transition-colors border border-[#d4af37]"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
