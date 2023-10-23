import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Leftsidebar from '@/components/leftside-bar/LeftsideBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="home"
        style={{
          display: 'flex',
          height: '100vh',
        }}
      >
        <Leftsidebar />
        {children}
      </body>
    </html>
  );
}
