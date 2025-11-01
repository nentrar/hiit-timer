import React, { useState, useEffect, useRef } from 'react';

const IOSPicker = ({ label, value, min, max, unit = '', onClose, onSave }) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const scrollRef = useRef(null);
  const itemHeight = 48;

  useEffect(() => {
    if (scrollRef.current) {
      const index = value - min;
      scrollRef.current.scrollTop = index * itemHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const newValue = min + index;
    if (newValue >= min && newValue <= max) {
      setSelectedValue(newValue);
    }
  };

  const items = [];
  for (let i = min; i <= max; i++) {
    items.push(i);
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="border-b border-black">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={onClose} className="text-black">Cancel</button>
          <h2 className="text-xl font-bold">{label}</h2>
          <button onClick={() => onSave(selectedValue)} className="text-black font-bold">Done</button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 border-t border-b border-black pointer-events-none" />
          
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-60 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            style={{ 
              scrollSnapType: 'y mandatory',
              scrollPaddingTop: '96px',
              scrollPaddingBottom: '96px'
            }}
          >
            <div className="h-24" />
            {items.map((item) => (
              <div 
                key={item}
                className="h-12 flex items-center justify-center snap-center text-2xl font-medium transition-opacity"
                style={{ 
                  opacity: item === selectedValue ? 1 : 0.3 
                }}
              >
                {item}{unit}
              </div>
            ))}
            <div className="h-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IOSPicker;