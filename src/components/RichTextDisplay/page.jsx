"use client";
import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'isomorphic-dompurify';

export default function RichTextDisplay({ content, className = "" }) {
  // Sanitize HTML - PENTING: jangan ubah struktur HTML
  const sanitizeConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'div'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  };

  const sanitizedContent = DOMPurify.sanitize(content || "", sanitizeConfig);

  if (!sanitizedContent || sanitizedContent.trim() === '') {
    return (
      <div className={`text-gray-500 italic ${className}`}>
        Tidak ada deskripsi
      </div>
    );
  }

  return (
    <div 
      className={`rich-text-display text-white ${className}`}
      style={{
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

RichTextDisplay.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
};