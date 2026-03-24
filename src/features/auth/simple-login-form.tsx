'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginSuccess, loginFailure } from '@/stores/reducers/auth-slice';

export const SimpleLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simple validation
      if (!email || !password) {
        throw new Error('Vui lòng nhập email và mật khẩu');
      }
      
      // Mock login logic
      if (email === 'test@example.com' && password === 'test123') {
        const mockUser = {
          id: '1',
          name: 'Nguyễn Văn A',
          email: email,
          avatar: '',
          bio: 'Tôi là người dùng test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          followersCount: 10,
          followingCount: 25,
          postsCount: 5,
          token: 'simple-mock-token-12345'
        };
        
        dispatch(loginSuccess(mockUser));
        console.log('Simple login successful:', mockUser);
        
        // Redirect to feed
        setTimeout(() => {
          router.push('/feed/simple');
        }, 1000);
        
      } else if (email === 'user2@example.com' && password === 'password123') {
        const mockUser2 = {
          id: '2',
          name: 'Trần Thị B',
          email: email,
          avatar: '',
          bio: 'Xin chào mọi người!',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          followersCount: 50,
          followingCount: 100,
          postsCount: 20,
          token: 'simple-mock-token-67890'
        };
        
        dispatch(loginSuccess(mockUser2));
        console.log('Simple login successful:', mockUser2);
        
        // Redirect to feed
        setTimeout(() => {
          router.push('/feed/simple');
        }, 1000);
        
      } else {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
      
    } catch (error: any) {
      console.error('Simple login error:', error);
      setError(error.message);
      dispatch(loginFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">🔐 Simple Login (No GraphQL)</h3>
      
      <div className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            <p className="font-medium">❌ {error}</p>
          </div>
        )}
        
        {/* Success Info */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
          <p className="text-sm">
            💡 <strong>Test Credentials:</strong><br/>
            📧 test@example.com / test123<br/>
            👤 user2@example.com / password123
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="email@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="•••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang đăng nhập...
              </div>
            ) : (
              'Đăng nhập (Simple Mode)'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
