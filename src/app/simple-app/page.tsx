'use client';

import React from 'react';
import { SimpleLoginForm } from '@/features/auth/simple-login-form';
import { SimpleFeedContent } from '@/components/simple-feed-content';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';

export default function SimpleAppPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <SimpleFeedContent />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-4">
            🎉 Đăng nhập Social Hub
          </h2>
          <p className="text-center text-sm text-gray-600 mb-4">
            Chào mừng! Đây là phiên bản đơn giản để test nhanh.
          </p>
        </div>
        
        <SimpleLoginForm />
        
        <div className="text-center mt-8">
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Đăng ký tài khoản mới
          </a>
          {' • '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
}
