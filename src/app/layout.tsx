import type { Metadata } from 'next';
import './globals.css';

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
      <body className="bg-canvas text-text-dark antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}