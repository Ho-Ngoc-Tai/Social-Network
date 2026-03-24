'use client';

import React, { useState } from 'react';
import { useClient } from '@/components/client-switcher';
import { gql } from '@apollo/client';

export const TestMutation: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { client, isMock } = useClient();

  const testLogin = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing login mutation...');
      
      const response = await client.mutate({
        mutation: gql`
          mutation TestLogin($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              id
              name
              email
              token
            }
          }
        `,
        variables: {
          email: 'test@example.com',
          password: 'test123'
        },
        errorPolicy: 'all'
      });

      console.log('Login Response:', response);
      setResult(`Success: ${JSON.stringify(response.data, null, 2)}`);
      
    } catch (error: any) {
      console.error('Login Error:', error);
      
      let errorMessage = 'Unknown error';
      if (error.networkError) {
        errorMessage = `Network: ${error.networkError.message || error.networkError}`;
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = `GraphQL: ${error.graphQLErrors.map((e: any) => e.message).join(', ')}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setResult(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testQuery = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing simple query...');
      
      const response = await client.query({
        query: gql`
          query TestQuery {
            __schema {
              types {
                name
              }
            }
          }
        `,
        errorPolicy: 'all'
      });

      console.log('Query Response:', response);
      setResult(`Query Success: ${response.data ? 'Data received' : 'No data'}`);
      
    } catch (error: any) {
      console.error('Query Error:', error);
      setResult(`Query Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">
        🧪 GraphQL Test 
        {isMock && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">MOCK MODE</span>}
      </h3>
      
      <div className="space-y-3">
        <div className="flex space-x-2">
          <button
            onClick={testQuery}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Query
          </button>
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Login
          </button>
        </div>
        
        {loading && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span>Testing...</span>
          </div>
        )}
        
        {result && (
          <div className="bg-gray-100 p-3 rounded text-sm">
            <pre className="whitespace-pre-wrap break-words">{result}</pre>
          </div>
        )}
        
        {isMock && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
            💡 Mock mode đang bật - không cần backend!
            <br />
            Test credentials: test@example.com / test123
          </div>
        )}
      </div>
    </div>
  );
};
