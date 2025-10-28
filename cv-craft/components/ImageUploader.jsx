'use client';

import React, { useEffect, useState } from 'react';

export default function ImageUploader({ keyName, initial = '/profile-placeholder.png', className = '' }) {
  const [src, setSrc] = useState(initial);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(keyName);
      if (stored) setSrc(stored);
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
  }, [keyName]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      setSrc(url);
      try {
        localStorage.setItem(keyName, url);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={className}>
      <img src={src} alt="profile" className="w-full h-full object-cover" />
      <input
        onChange={onFile}
        aria-label="Upload image"
        type="file"
        accept="image/*"
        className="mt-2 text-sm"
      />
    </div>
  );
}
