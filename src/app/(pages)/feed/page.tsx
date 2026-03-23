'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedStart } from '@/stores/reducers/feed-slice';
import { RootState } from '@/stores';

export default function FeedPage() {
  const dispatch = useDispatch();
  const { feed, loading } = useSelector((state: RootState) => state.feed);

  useEffect(() => {
    dispatch(fetchFeedStart());
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bảng tin</h1>
        
        {/* Create Post Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <textarea
            placeholder="Bạn đang nghĩ gì?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
          />
          <div className="mt-3 flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                🖼️ Ảnh
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                😊 Cảm xúc
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                📍 Check-in
              </button>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Đăng
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        )}

        {/* Feed Posts */}
        <div className="space-y-4">
          {feed.items.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
              <p className="text-gray-600">Hãy là người đầu tiên chia sẻ điều gì đó!</p>
            </div>
          ) : (
            feed.items.map((post: any) => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{post.author?.name || 'Người dùng'}</p>
                      <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    ⋮
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Post Image (if any) */}
                {post.image && (
                  <div className="mb-4">
                    <img 
                      src={post.image} 
                      alt="Post image" 
                      className="w-full rounded-lg object-cover max-h-96"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}>
                      <span>{post.isLiked ? '❤️' : '🤍'}</span>
                      <span className="text-sm">{post.likesCount || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <span>💬</span>
                      <span className="text-sm">{post.commentsCount || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
                      <span>🔄</span>
                      <span className="text-sm">Chia sẻ</span>
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700 transition-colors">
                    🔖 Lưu
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {feed.hasMore && (
          <div className="text-center mt-6">
            <button 
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => {/* TODO: Implement load more */}}
            >
              Tải thêm bài viết
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
