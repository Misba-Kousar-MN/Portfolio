import { Inter, Playfair_Display } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  fallback: ['Georgia', 'Cambria', 'serif'],
});

// Backward compatibility aliases
export const newsreader = playfair;
export const satoshi = {
  variable: '--font-sans',
};