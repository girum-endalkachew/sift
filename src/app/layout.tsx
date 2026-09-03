import type { Metadata } from 'next';
import './globals.css';
import { SearchProvider } from '@/components/layout/SearchProvider';

export const metadata: Metadata = {
  title: 'Sift — Organized Workspace',
  description: 'Turn messy information into an organized workspace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="ambient-bg text-text-light antialiased min-h-screen">
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}