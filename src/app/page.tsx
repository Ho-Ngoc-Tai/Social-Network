'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                🌐 Social Network
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Chào mừng đến với
            <br />
            <span className="text-indigo-600">Mạng Xã Hội</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Kết nối với bạn bè, chia sẻ khoảnh khắc, và khám phá thế giới xung quanh bạn.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-indigo-700 transition-colors"
            >
              Bắt đầu ngay
            </Link>
            <Link
              href="/login"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-base font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Tính năng chính
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Khám phá những gì bạn có thể làm trên mạng xã hội của chúng tôi
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chia sẻ bài viết
              </h3>
              <p className="text-gray-600">
                Viết và chia sẻ suy nghĩ, hình ảnh, và video với bạn bè và gia đình.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Kết nối bạn bè
              </h3>
              <p className="text-gray-600">
                Tìm và kết nối với bạn bè cũ, đồng nghiệp, và những người có cùng sở thích.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bình luận và tương tác
              </h3>
              <p className="text-gray-600">
                Tham gia vào cuộc trò chuyện, thích và chia sẻ nội dung bạn yêu thích.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bảo mật và an toàn
              </h3>
              <p className="text-gray-600">
                Dữ liệu của bạn được bảo vệ với công nghệ mã hóa tiên tiến.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Đa nền tảng
              </h3>
              <p className="text-gray-600">
                Truy cập từ mọi thiết bị - điện thoại, máy tính bảng, và máy tính.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Khám phá nội dung
              </h3>
              <p className="text-gray-600">
                Khám phá nội dung từ khắp nơi trên thế giới được cá nhân hóa cho bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">
              © 2024 Social Network. Đã đăng ký bản quyền.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Điều khoản
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
