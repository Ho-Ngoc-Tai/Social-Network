'use client';

import React, { useState, useEffect } from 'react';

export const SimpleTest: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('SimpleTest mounted');
  }, []);

  if (!mounted) {
    return (
      <div className="bg-yellow-100 p-4 rounded">
        <p>🔄 Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-green-100 p-4 rounded">
      <h3 className="font-bold mb-2">✅ Component Mounted Successfully!</h3>
      <p className="text-sm">React hydration working correctly</p>
      <div className="mt-2 text-xs">
        <p>Window available: {typeof window !== 'undefined' ? 'Yes' : 'No'}</p>
        <p>LocalStorage available: {typeof localStorage !== 'undefined' ? 'Yes' : 'No'}</p>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};
