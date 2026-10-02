import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CallAI | Razorpay Autopay Voice Recovery Agent',
  description: 'Autonomous AI Voice Agent platform for failed autopay payment recovery. Built for Razorpay Forward Deployed Engineering (FDE).',
  keywords: ['Razorpay', 'Autopay', 'Voice Agent', 'FDE', 'UPI Autopay', 'e-NACH', 'Vapi.ai', 'Linear', 'Stripe'],
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
