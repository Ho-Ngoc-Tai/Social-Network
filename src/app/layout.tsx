import { ApolloProvider } from '../providers/apollo-provider';
import { ReduxProvider } from '../providers/redux-provider';
import './globals.css';


export const metadata = {
  title: 'Social Network',
  description: 'A modern social network platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ApolloProvider>
            {children}
          </ApolloProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
