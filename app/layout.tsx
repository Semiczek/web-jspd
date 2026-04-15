import './globals.css';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'JSPD Holding',
  description: 'Holdingový web pro cleaning, tech, gastro, stavby a demo systému.',
  icons: {
    icon: '/jspd-logo.png',
    shortcut: '/jspd-logo.png',
    apple: '/jspd-logo.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
