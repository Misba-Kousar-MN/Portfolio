import type { Metadata } from 'next';
import { inter, playfair } from '@/lib/fonts';
import { ThemeProvider } from '@/hooks/useTheme';
import { ScrollProvider } from '@/hooks/useScroll';
import { PublicLayoutShell } from '@/components/layout/PublicLayoutShell';
import { generateMetadata, personSchema, websiteSchema } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-background-primary text-text-primary antialiased paper-grid">
        <ThemeProvider>
          <ScrollProvider>
            <PublicLayoutShell>
              {children}
            </PublicLayoutShell>
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
