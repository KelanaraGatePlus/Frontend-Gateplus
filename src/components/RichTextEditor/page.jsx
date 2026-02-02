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
}, ref) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const isUpdatingRef = useRef(false);

  // Sync value from parent to editor
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      if (currentHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Handle text formatting
  const formatText = (command) => {
    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().length > 0;

    if (command === 'insertParagraph' || command === 'insertLineBreak') {
      if (command === 'insertParagraph') {
        document.execCommand('formatBlock', false, 'p');
      } else {
        document.execCommand('insertHTML', false, '<br>');
      }
    } else if (hasSelection) {
      document.execCommand(command, false, null);
    }
    
    editorRef.current?.focus();
    updateContent();
  };

  // Update content and notify parent
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

  // Handle input changes
  const handleInput = () => {
    updateContent();
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      formatText('bold');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      formatText('italic');
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertParagraph', false, null);
      updateContent();
    }
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br>');
      updateContent();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Label */}
      {label && (
        <label 
          htmlFor={name} 
          className="text-sm font-medium text-white md:text-base"
        >
          {label}
        </label>
      )}

      {/* Toolbar */}
      <div className={`
        flex items-center gap-2 p-3 
        bg-gradient-to-r from-gray-900 to-gray-800 
        border-2 rounded-t-xl transition-all duration-200
        ${isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700'}
      `}>
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="group relative px-4 py-2 bg-gray-800 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-bold text-sm border border-gray-700 hover:border-blue-500 shadow-sm hover:shadow-md"
          title="Bold (Ctrl+B)"
        >
          <span className="relative z-10">B</span>
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
        </button>

        <button
          type="button"
          onClick={() => formatText('italic')}
          className="group relative px-4 py-2 bg-gray-800 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 italic text-sm border border-gray-700 hover:border-blue-500 shadow-sm hover:shadow-md"
          title="Italic (Ctrl+I)"
        >
          <span className="relative z-10">I</span>
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        <button
          type="button"
          onClick={() => formatText('insertParagraph')}
          className="group relative px-4 py-2 bg-gray-800 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 text-sm flex items-center gap-1 border border-gray-700 hover:border-purple-500 shadow-sm hover:shadow-md"
          title="New Paragraph (Enter)"
        >
          <span className="relative z-10 text-lg">¶</span>
          <span className="relative z-10 text-xs">Para</span>
          <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
        </button>

        <button
          type="button"
          onClick={() => formatText('insertLineBreak')}
          className="group relative px-4 py-2 bg-gray-800 hover:bg-green-600 text-white rounded-lg transition-all duration-200 text-sm flex items-center gap-1 border border-gray-700 hover:border-green-500 shadow-sm hover:shadow-md"
          title="Line Break (Shift+Enter)"
        >
          <span className="relative z-10 text-lg">↵</span>
          <span className="relative z-10 text-xs">Break</span>
          <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
        </button>
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
className={`
  rich-text-editor
  min-h-[200px] max-h-[500px] overflow-y-auto
  p-4 bg-gray-900
  border-2 rounded-b-xl
  text-white text-base leading-relaxed
  transition-all duration-200
  ${isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/20' : error ? 'border-red-500' : 'border-gray-700'}
  focus:outline-none
  [&_strong]:text-white [&_b]:text-white [&_em]:text-white [&_i]:text-white
`}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-1 animate-pulse">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      <div className="flex items-start gap-2 text-gray-400 text-xs mt-1">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <p className="font-medium mb-1">Tips penggunaan:</p>
          <ul className="space-y-0.5 ml-2">
            <li>• <kbd className="px-1 py-0.5 bg-gray-800 rounded text-xs">Ctrl+B</kbd> untuk <strong>Bold</strong></li>
            <li>• <kbd className="px-1 py-0.5 bg-gray-800 rounded text-xs">Ctrl+I</kbd> untuk <em>Italic</em></li>
            <li>• <kbd className="px-1 py-0.5 bg-gray-800 rounded text-xs">Enter</kbd> untuk paragraf baru</li>
            <li>• <kbd className="px-1 py-0.5 bg-gray-800 rounded text-xs">Shift+Enter</kbd> untuk line break</li>
            <li>• Pilih teks dulu sebelum klik Bold/Italic</li>
          </ul>
        </div>
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