// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'METSUMI',
  description: 'METSUMI',
  themeColor: '#1a0f1f',
  other: {
    'color-scheme': 'dark light',
    'og:title': 'METSUMI',
    'og:description': '$METSUMI.',
    'og:type': 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="auto" suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
        {/* Set theme early to avoid hydration mismatch */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var m = localStorage.getItem('metsumi_theme') || 'auto';
                  document.documentElement.setAttribute('data-theme', m);
                } catch(e){}
              })();
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="crt">
        {children}
      </body>
    </html>
  );
}
