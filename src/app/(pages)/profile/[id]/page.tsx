'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchProfileStart } from '@/stores/reducers/profile-slice';
import { RootState } from '@/stores';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const params = useParams();
  const { profile, loading } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      dispatch(fetchProfileStart(params.id));
    }
  }, [dispatch, params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy người dùng</h2>
          <p className="text-gray-600">Người dùng này không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profile.name?.[0] || 'U'}
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            <p className="text-gray-600 mb-4">{profile.bio || 'Chưa có tiểu sử'}</p>
            
            {/* Stats */}
            <div className="flex space-x-8 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{profile.postsCount}</p>
                <p className="text-sm text-gray-600">Bài viết</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{profile.followersCount}</p>
                <p className="text-sm text-gray-600">Người theo dõi</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{profile.followingCount}</p>
                <p className="text-sm text-gray-600">Đang theo dõi</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Theo dõi
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Nhắn tin
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                ⋮
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button className="py-4 px-1 border-b-2 border-indigo-500 font-medium text-indigo-600">
              Bài viết
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Giới thiệu
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Ảnh
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Bạn bè
            </button>
          </nav>
        </div>

        {/* Posts Content */}
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-600">
              {profile.name} chưa chia sẻ bài viết nào.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
