import { LoginForm } from '@/features/auth/login-form';
import { SimpleLoginForm } from '@/features/auth/simple-login-form';
import { TestMutation } from '@/components/test-mutation';
import { SimpleTest } from '@/components/simple-test';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="mb-4">
          <SimpleTest />
        </div>
        
        {/* Hide GraphQL test for simple mode */}
        {/* <div className="mb-4">
          <ConnectionStatus />
        </div> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* GraphQL Login */}
          <div>
            <div className="mb-4">
              <TestMutation />
            </div>
            <div>
              <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 mb-4">
                🔗 GraphQL Login
              </h2>
              <p className="text-center text-sm text-gray-600 mb-4">
                Cần backend đang chạy
              </p>
              <LoginForm />
            </div>
          </div>
          
          {/* Simple Login */}
          <div>
            <SimpleLoginForm />
          </div>
        </div>
        
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
