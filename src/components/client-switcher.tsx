'use client';

import React, { useState, createContext, useContext } from 'react';
import { ApolloClient } from '@apollo/client';
import { client } from '@/libs/apollo-client';
import { mockClientInstance } from '@/libs/mock-apollo-client';

interface ClientContextType {
  client: ApolloClient<any>;
  isMock: boolean;
  toggleClient: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within ClientProvider');
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMock, setIsMock] = useState(false); // Default to false to avoid hydration
  
  React.useEffect(() => {
    // Set initial value after mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('useMockClient');
      setIsMock(saved !== null ? JSON.parse(saved) : true);
    }
  }, []);

  const currentClient = isMock ? mockClientInstance : client;

  const toggleClient = () => {
    const newIsMock = !isMock;
    setIsMock(newIsMock);
    if (typeof window !== 'undefined') {
      localStorage.setItem('useMockClient', JSON.stringify(newIsMock));
    }
    // Reload to apply new client
    window.location.reload();
  };

  return (
    <ClientContext.Provider value={{ client: currentClient, isMock, toggleClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const ClientSwitcher: React.FC = () => {
  const { isMock, toggleClient } = useClient();

  if (typeof window === 'undefined') {
    return null; // Don't render on server
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
        <h3 className="font-semibold text-sm mb-2">🔧 GraphQL Client</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="mock"
              checked={isMock}
              onChange={() => {}} // Prevent onChange during hydration
              className="text-blue-600"
            />
            <label htmlFor="mock" className="text-sm cursor-pointer" onClick={toggleClient}>
              🧪 Mock Client (Test Data)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="real"
              checked={!isMock}
              onChange={() => {}} // Prevent onChange during hydration
              className="text-blue-600"
            />
            <label htmlFor="real" className="text-sm cursor-pointer" onClick={toggleClient}>
              🌐 Real Client (Backend)
            </label>
          </div>
        </div>
        <button
          onClick={toggleClient}
          className="mt-3 w-full bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700"
        >
          Switch to {isMock ? 'Real' : 'Mock'} Client
        </button>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            {isMock ? 
              "🧪 Đang dùng mock data - không cần backend" : 
              "🌐 Đang kết nối thật - cần backend chạy"
            }
          </p>
        </div>
      </div>
    </div>
  );
};
