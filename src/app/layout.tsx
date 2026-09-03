import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScriptLoader from '@/components/ScriptLoader'
import './globals.css'

export const metadata: Metadata = {
  title: 'FEC | Docquery',
  description: 'FEC information on electronic filing, including how to get a password, filing software, mandatory electronic filing threshold, ways to file electronically',
  metadataBase: new URL('https://www.fec.gov'),
  openGraph: {
    type: 'website',
    url: '/help-candidates-and-committees/filing-reports/electronic-filing/',
    title: 'Electronic filing overview - FEC.gov',
    siteName: 'FEC.gov',
    description: 'FEC information on electronic filing, including how to get a password, filing software, mandatory electronic filing threshold, ways to file electronically',
    images: ['/static/img/social/help.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electronic filing overview - FEC.gov',
    description: 'FEC information on electronic filing, including how to get a password, filing software, mandatory electronic filing threshold, ways to file electronically',
    images: ['/static/img/social/help.png'],
  },
  verification: {
    google: 'rEjjZg6JSzXZCFwXo_8bNKK68jrZdqV-yhDqJluWb8k',
    other: {
      'msvalidate.01': 'A6E2BFF1CD488F37FC4A42640E760D02',
    },
  },
  icons: {
    icon: [
      { url: '/img/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/img/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/img/favicon/help/apple-touch-icon-57x57.png', sizes: '57x57' },
      { url: '/img/favicon/help/apple-touch-icon-72x72.png', sizes: '72x72' },
      { url: '/img/favicon/help/apple-touch-icon-114x114.png', sizes: '114x114' },
      { url: '/img/favicon/help/apple-touch-icon-120x120.png', sizes: '120x120' },
      { url: '/img/favicon/help/apple-touch-icon-144x144.png', sizes: '144x144' },
      { url: '/img/favicon/help/apple-touch-icon-152x152.png', sizes: '152x152' },
    ],
  },
  other: {
    'application-name': ' ',
    'msapplication-TileColor': '#FFFFFF',
    'msapplication-TileImage': '/img/favicon/general/mstile-144x144.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <link rel="canonical" href="https://www.fec.gov/help-candidates-and-committees/filing-reports/electronic-filing/" />

        {/* FEC stylesheets (served from public/css) */}
        <link rel="stylesheet" href="/css/custom.css" />
        <link rel="stylesheet" href="/css/data-landing.css" />
        <link rel="stylesheet" href="/css/base.css" />
        <link rel="stylesheet" href="/css/base-fec.css" />
        <link rel="stylesheet" href="/css/entity.css" />

        {/* jQuery and jQuery UI CSS */}
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css" />
      </head>
      <body className="template-custom-page">
        <noscript>
          <div style={{ backgroundColor: '#212121', padding: '10px' }}>
            <h2 style={{ color: '#ffffff' }}>Your browser is outdated</h2>
            <p style={{ color: '#ffffff', fontSize: '16px' }}>
              You&apos;re using an older version of Internet Explorer. Please update or switch to another browser like Chrome, Firefox, or Safari for a better experience.
            </p>
            <p style={{ color: '#ffffff', fontSize: '16px' }}>
              <a
                rel="noopener noreferrer"
                style={{ color: '#ffffff', textDecoration: 'underline' }}
                target="_blank"
                href="https://browsehappy.com/"
              >
                Learn how to update your browser.
              </a>
            </p>
          </div>
        </noscript>

        <a href="#main" className="skip-nav">skip navigation</a>

        <Header />

        <main id="main">
          {children}
        </main>

        <Footer />

        {/* Client component to handle sequential script loading */}
        <ScriptLoader />
      </body>
    </html>
  )
}