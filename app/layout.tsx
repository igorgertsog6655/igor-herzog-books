import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const siteUrl = 'https://igorgertsog6655.github.io/igor-herzog-books';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Игорь ГЕРЦОГ — истории, которые остаются с нами',
  description: 'Красочные авторские сказки и книги по персональному заказу.',
  keywords: ['детские книги', 'авторские сказки', 'персональная книга', 'Igor Herzog', "children's books"],
  authors: [{ name: 'Игорь ГЕРЦОГ' }],
  icons: { icon: `${siteUrl}/favicon.png`, apple: `${siteUrl}/favicon.png` },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Igor Herzog Story Worlds',
    title: 'Истории, которые остаются с нами',
    description: 'Авторские сказки Игоря ГЕРЦОГА и книги по персональному заказу.',
    locale: 'ru_RU',
    alternateLocale: ['en_US'],
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: 'Истории Игоря ГЕРЦОГА' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Истории, которые остаются с нами',
    description: 'Авторские сказки и персональные книги.',
    images: [`${siteUrl}/og.png`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};window.plausible.init=window.plausible.init||function(i){window.plausible.o=i||{}};window.plausible.init();' }} />
      </head>
      <body>
        {children}
        <Script src="https://plausible.io/js/pa-KFjADJ4JCi9FstoqcfAs1.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
