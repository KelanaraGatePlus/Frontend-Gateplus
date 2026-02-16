"use client";
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const RichTextEditor = forwardRef(({ 
  label, 
  name, 
  placeholder = "Tulis deskripsi...", 
  value = "", 
  onChange, 
  error 
}) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
  });
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      if (currentHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
    });
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
    updateActiveFormats();
  };

  const updateContent = () => {
    if (editorRef.current && onChange) {
      isUpdatingRef.current = true;
      const content = editorRef.current.innerHTML;
      onChange({
        target: {
          name,
          value: content
        }
      });
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const handleInput = () => {
    updateContent();
    updateActiveFormats();
  };

  const handlePaste = (e) => {
    e.preventDefault();

    // Ambil HTML dari clipboard
    let html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
      // ✅ Bersihkan hanya yang berbahaya, PERTAHANKAN formatting & struktur
      html = html
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/style="[^"]*"/gi, '') // Hapus inline styles (opsional)
        .replace(/class="[^"]*"/gi, '')
        .replace(/id="[^"]*"/gi, '')
        .replace(/on\w+="[^"]*"/gi, ''); // Hapus event handlers

      // Insert HTML yang sudah dibersihkan
      document.execCommand('insertHTML', false, html);
    } else {
      // Plain text - pertahankan line breaks
      const htmlText = text.replace(/\n/g, '<br>');
      document.execCommand('insertHTML', false, htmlText);
    }

    // Update state
    setTimeout(() => {
      updateContent();
      updateActiveFormats();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      formatText('bold');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      formatText('italic');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      formatText('underline');
    }
  };

  const handleSelectionChange = () => {
    if (document.activeElement === editorRef.current) {
      updateActiveFormats();
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const ToolbarButton = ({ icon, title, onClick, isActive = false, tooltip }) => (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={`
          relative flex items-center justify-center w-8 h-8 rounded-md
          transition-all duration-150 ease-out
          ${isActive
            ? 'bg-blue-500/20 text-blue-400 shadow-inner'
            : 'text-gray-400 hover:bg-white/5 hover:text-white active:scale-95'
          }
        `}
        title={title}
      >
        {icon}
      </button>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {tooltip || title}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  ToolbarButton.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    tooltip: PropTypes.string,
  };

  const Divider = () => (
    <div className="w-px h-5 bg-white/10" />
  );

  return (
    <div className="flex items-start gap-2">
      {/* Label - Sama persis dengan InputText */}
      <h3 className="montserratFont flex-2 text-base font-semibold text-white md:text-base lg:text-xl">
        {label}
      </h3>

      {/* Main Container - Sama persis dengan InputText */}
      <div className="flex w-full flex-4 text-white md:flex-10 flex-col">
        <div className={`
          group rounded-xl overflow-hidden w-full
          bg-gradient-to-b from-[#252525] to-[#1a1a1a]
          border transition-all duration-200
          ${isFocused
            ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
            : error
              ? 'border-red-500'
              : 'border-[#F5F5F540]'
          }
        `}>
          {/* Toolbar - Sticky */}
          <div className="sticky top-0 z-10 flex items-center gap-0.5 px-3 py-2 bg-[#2a2a2a]/95 backdrop-blur-sm border-b border-white/5">
            {/* Text Style Group */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton
                icon={<span className="font-bold text-[13px]">B</span>}
                title="Bold"
                tooltip="Bold (Ctrl+B)"
                onClick={() => formatText('bold')}
                isActive={activeFormats.bold}
              />
              <ToolbarButton
                icon={<span className="italic text-[13px] font-serif">I</span>}
                title="Italic"
                tooltip="Italic (Ctrl+I)"
                onClick={() => formatText('italic')}
                isActive={activeFormats.italic}
              />
              <ToolbarButton
                icon={<span className="underline text-[13px]">U</span>}
                title="Underline"
                tooltip="Underline (Ctrl+U)"
                onClick={() => formatText('underline')}
                isActive={activeFormats.underline}
              />
              <ToolbarButton
                icon={<span className="line-through text-[13px]">S</span>}
                title="Strikethrough"
                tooltip="Strikethrough"
                onClick={() => formatText('strikeThrough')}
                isActive={activeFormats.strikeThrough}
              />
            </div>

            <Divider />

            {/* Alignment Group */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="15" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                }
                title="Align Left"
                onClick={() => formatText('justifyLeft')}
              />
              <ToolbarButton
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="6" y1="12" x2="18" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                }
                title="Align Center"
                onClick={() => formatText('justifyCenter')}
              />
              <ToolbarButton
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="9" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                }
                title="Align Right"
                onClick={() => formatText('justifyRight')}
              />
            </div>

            <Divider />

            {/* List Group */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="9" y1="6" x2="20" y2="6" />
                    <line x1="9" y1="12" x2="20" y2="12" />
                    <line x1="9" y1="18" x2="20" y2="18" />
                    <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
                    <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
                    <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
                  </svg>
                }
                title="Bullet List"
                onClick={() => formatText('insertUnorderedList')}
              />
              <ToolbarButton
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="9" y1="6" x2="20" y2="6" />
                    <line x1="9" y1="12" x2="20" y2="12" />
                    <line x1="9" y1="18" x2="20" y2="18" />
                    <text x="3" y="8" fontSize="8" fill="currentColor" fontWeight="600">1</text>
                    <text x="3" y="14" fontSize="8" fill="currentColor" fontWeight="600">2</text>
                    <text x="3" y="20" fontSize="8" fill="currentColor" fontWeight="600">3</text>
                  </svg>
                }
                title="Numbered List"
                onClick={() => formatText('insertOrderedList')}
              />
            </div>
          </div>

          {/* Editor Area */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="
              rich-text-editor
              min-h-[240px] max-h-[500px] overflow-y-auto
              px-4 py-4
              text-white/90 text-[15px] leading-[1.7]
              focus:outline-none
              selection:bg-blue-500/30
            "
            data-placeholder={placeholder}
            suppressContentEditableWarning
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          />
        </div>

        {/* Error or Helper Text */}
        {error ? (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        ) : (
          <p className="text-white/40 text-xs mt-1">
            {placeholder}
          </p>
        )}
      </div>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

RichTextEditor.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
};

export default RichTextEditor;