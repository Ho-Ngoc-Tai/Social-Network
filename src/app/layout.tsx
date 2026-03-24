import './globals.css';
import type { Metadata } from 'next';
import { ReduxProvider } from '@/providers/redux-provider';
import { ApolloProvider } from '@/providers/apollo-provider';
import { DebugPanel } from '@/components/debug-panel';
import { ClientSwitcher } from '@/components/client-switcher';

export const metadata: Metadata = {
  title: 'Social Hub - Mạng Xã Hội',
  description: 'Kết nối với bạn bè, chia sẻ khoảnh khắc, và khám phá thế giới',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ApolloProvider>
          <ReduxProvider>
            {children}
            <DebugPanel />
            <ClientSwitcher />
          </ReduxProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
