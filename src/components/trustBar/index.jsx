import React, { useState } from 'react';
import { useApp } from '../../context';

export function TrustBar() {
  const { trustItems } = useApp();
  const [selectedTrust, setSelectedTrust] = useState(null);

  if (!trustItems || trustItems.length === 0) return null;

  return (
    <section>
      <div className="grid grid-cols-4 gap-2">
        {trustItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTrust(item)}
            className="bg-[#073b27] border border-[#d4af37]/20 rounded-xl p-2 flex flex-col items-center gap-1.5 text-center hover:border-[#d4af37]/40 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
              <i className={item.iconClass} />
            </div>
            <span className="text-[10px] font-bold text-white line-clamp-1">{item.title}</span>
          </button>
        ))}
      </div>

      {selectedTrust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTrust(null)} />
          <div className="relative bg-[#073b27] border border-[#d4af37]/30 rounded-2xl p-4 max-w-xs w-full z-10 text-white flex flex-col gap-2 text-center">
            <h3 className="text-xs font-bold text-[#d4af37]">{selectedTrust.title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{selectedTrust.description}</p>
            <button
              onClick={() => setSelectedTrust(null)}
              className="mt-2 bg-[#d4af37] text-[#042a1b] py-1.5 rounded-lg text-xs font-bold"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default TrustBar;
