'use client';

import React, { useState, useEffect } from 'react';
import { checkGraphQLConnection } from '@/libs/apollo-client';

export const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      setStatus('checking');
      const result = await checkGraphQLConnection();
      
      if (result.success) {
        setStatus('connected');
      } else {
        setStatus('error');
        setError(result.error || 'Unknown error');
      }
    };

    checkConnection();
  }, []);

  if (status === 'checking') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
          <span>Đang kiểm tra kết nối GraphQL...</span>
        </div>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
        <div className="flex items-center">
          <span className="mr-2">✅</span>
          <span>Đã kết nối thành công đến GraphQL server!</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        <div className="flex items-start">
          <span className="mr-2">❌</span>
          <div>
            <p className="font-medium">Lỗi kết nối GraphQL!</p>
            <p className="text-sm mt-1">{error}</p>
            <div className="mt-2 text-sm">
              <p className="font-medium">Kiểm tra:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Backend đã chạy chưa? (NestJS server)</li>
                <li>GraphQL endpoint có đúng không?</li>
                <li>Có đang chạy đúng port không? (mặc định: 3001)</li>
                <li>Firewall có chặn không?</li>
              </ul>
              <p className="mt-2">
                <strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
