import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panta | Smart Intake for Trucking",
  description: "Get your trucking insurance quote in minutes, not weeks. Simple questions, fast results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header style={{
          padding: '0.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A3F2F',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#D4C5A6',
            letterSpacing: '0.02em'
          }}>
            Panta
          </span>
        </header>
        <main style={{ padding: '2rem 1rem', minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
