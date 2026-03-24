'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';

// Mock data
const mockPosts = [
  {
    id: '1',
    content: 'Chào mừng đến với Social Hub! 🎉\n\nĐây là bài viết đầu tiên của tôi. Rất vui được kết nối với mọi người.',
    author: {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'test@example.com',
      avatar: '',
      bio: 'Tôi là người dùng test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followersCount: 10,
      followingCount: 25,
      postsCount: 5,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 15,
    commentsCount: 3,
    isLiked: true,
    image: null
  },
  {
    id: '2',
    content: 'Hôm nay trời đẹp quá! ☀️\n\nMọi người có một ngày tuyệt vời nhé!',
    author: {
      id: '2',
      name: 'Trần Thị B',
      email: 'user2@example.com',
      avatar: '',
      bio: 'Xin chào mọi người!',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      followersCount: 50,
      followingCount: 100,
      postsCount: 20,
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    likesCount: 28,
    commentsCount: 7,
    isLiked: false,
    image: null
  },
  {
    id: '3',
    content: 'Mới học được một công thức hay quá! 🧪\n\nChia sẻ cho mọi người cùng biết nhé.',
    author: {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'test@example.com',
      avatar: '',
      bio: 'Tôi là người dùng test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followersCount: 10,
      followingCount: 25,
      postsCount: 5,
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    likesCount: 42,
    commentsCount: 12,
    isLiked: true,
    image: null
  }
];

export const SimpleFeedContent: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && mounted) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, mounted]);

  const handleLike = (postId: string) => {
    console.log('Like post:', postId);
    // TODO: Implement like functionality
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
    // TODO: Implement comment functionality
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
    // TODO: Implement share functionality
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem bảng tin</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">🌐 Social Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Xin chào, {user?.name}!</span>
              <button 
                onClick={() => {
                  // TODO: Implement logout
                  console.log('Logout clicked');
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Create Post Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Tạo bài viết mới</h2>
          <div className="space-y-4">
            <textarea
              placeholder="Bạn đang nghĩ gì? Hãy chia sẻ với mọi người!"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Thêm ảnh">
                  🖼️
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Thêm cảm xúc">
                  😊
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Check-in">
                  📍
                </button>
              </div>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Đăng bài
              </button>
            </div>
          </div>
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📰 Bảng tin</h2>
          
          {mockPosts.map((post) => (
            <div key={post.id} className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  ⋮
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
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
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
                  >
                    <span>{post.isLiked ? '❤️' : '🤍'}</span>
                    <span className="text-sm font-medium">{post.likesCount}</span>
                  </button>
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <span>💬</span>
                    <span className="text-sm font-medium">{post.commentsCount}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
                  >
                    <span>🔄</span>
                    <span className="text-sm font-medium">Chia sẻ</span>
                  </button>
                </div>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  🔖 Lưu bài viết
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 Social Hub. Đã đăng ký bản quyền.</p>
            <div className="mt-2 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-600">Điều khoản</a>
              <a href="#" className="text-gray-400 hover:text-gray-600">Chính sách bảo mật</a>
              <a href="#" className="text-gray-400 hover:text-gray-600">Liên hệ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
