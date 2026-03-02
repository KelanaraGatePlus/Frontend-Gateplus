"use client";
import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

export default function RichTextDisplay({ content, className = "" }) {
  const sanitizeConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'div', 'u', 's', 'strike', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['style', 'class'],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  };

  const sanitizedContent = DOMPurify.sanitize(content || "", sanitizeConfig);

  if (!sanitizedContent || sanitizedContent.trim() === '') {
    return (
      <div className={`text-gray-400 italic text-sm ${className}`}>
        Tidak ada deskripsi
      </div>
    );
  }

  return (
    <div 
      className={`rich-text-display ${className}`}
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