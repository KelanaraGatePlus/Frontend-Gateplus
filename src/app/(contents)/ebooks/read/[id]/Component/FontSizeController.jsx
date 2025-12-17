import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

export default function FontSizeController({ 
  isOpen, 
  fontSizeFactor, 
  onFontSizeChange,
  containerClassName = '',
  isDarkMode = false,
}) {
  if (!isOpen) return null;

  return (
    <div className={`flex flex-col z-30 ${containerClassName}`}>
      {/* Triangle pointer */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderBottom: '14px solid rgba(255, 255, 255, 0.1)',
          margin: '0 auto',
        }}
      />

      <div 
        className={`${isDarkMode ? 'text-white' : 'text-black'} flex flex-row items-center justify-center gap-1 rounded-full bg-white/20 backdrop-blur border border-white/30 px-4 py-1 shadow-lg`}
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={() => onFontSizeChange(-0.1)}
          className="hover:opacity-70 transition-opacity"
          aria-label="Decrease font size"
        >
          <Icon icon={'solar:rounded-magnifer-zoom-out-outline'} className="w-10 h-10" />
        </button>
        <div className="bg-[#515151] py-4 px-8 text-white rounded-full text-[16px] montserratFont font-medium">
          <p>{Math.round(fontSizeFactor * 16)}px</p>
        </div>
        <button
          onClick={() => onFontSizeChange(0.1)}
          className="hover:opacity-70 transition-opacity"
          aria-label="Increase font size"
        >
          <Icon icon={'solar:rounded-magnifer-zoom-in-outline'} className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}

FontSizeController.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  fontSizeFactor: PropTypes.number.isRequired,
  onFontSizeChange: PropTypes.func.isRequired,
  containerClassName: PropTypes.string,
};
