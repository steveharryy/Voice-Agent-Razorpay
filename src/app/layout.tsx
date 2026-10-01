import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Razorpay R-Recover | Autopay Voice Recovery Agent',
  description: 'Autonomous AI Voice Agent for Recovering Failed Autopay Payments. Built for Razorpay Forward Deployed Engineering (FDE).',
  keywords: ['Razorpay', 'Autopay', 'Subscriptions', 'Voice Agent', 'FDE', 'UPI Autopay', 'e-NACH', 'Vapi.ai'],
  authors: [{ name: 'Razorpay FDE Candidate' }],
};

export const viewport: Viewport = {
  themeColor: '#060b17',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
