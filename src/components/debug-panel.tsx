'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';

export const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  const feed = useSelector((state: RootState) => state.feed);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-2 rounded-t-lg text-sm hover:bg-gray-700"
      >
        🐛 Debug
      </button>
      
      {isOpen && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-96 max-h-96 overflow-auto">
          <h3 className="font-bold text-lg mb-3">Debug Information</h3>
          
          <div className="space-y-4">
            {/* Environment */}
            <div>
              <h4 className="font-semibold text-sm">Environment</h4>
              <div className="text-xs bg-gray-100 p-2 rounded mt-1">
                <p><strong>GraphQL URL:</strong> {process.env.NEXT_PUBLIC_GRAPHQL_URL || 'Not set'}</p>
                <p><strong>Node Env:</strong> {process.env.NODE_ENV}</p>
              </div>
            </div>

            {/* Auth State */}
            <div>
              <h4 className="font-semibold text-sm">Auth State</h4>
              <div className="text-xs bg-gray-100 p-2 rounded mt-1">
                <p><strong>Loading:</strong> {auth.loading.toString()}</p>
                <p><strong>Authenticated:</strong> {auth.isAuthenticated.toString()}</p>
                <p><strong>Error:</strong> {auth.error || 'None'}</p>
                <p><strong>User:</strong> {auth.user ? JSON.stringify(auth.user, null, 2) : 'None'}</p>
              </div>
            </div>

            {/* Feed State */}
            <div>
              <h4 className="font-semibold text-sm">Feed State</h4>
              <div className="text-xs bg-gray-100 p-2 rounded mt-1">
                <p><strong>Loading:</strong> {feed.loading.toString()}</p>
                <p><strong>Error:</strong> {feed.error || 'None'}</p>
                <p><strong>Items Count:</strong> {feed.items?.length || 0}</p>
                <p><strong>Has More:</strong> {feed.hasMore?.toString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="font-semibold text-sm">Quick Actions</h4>
              <div className="space-y-2 mt-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  🔄 Reload Page
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  🗑️ Clear Local Storage & Reload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
