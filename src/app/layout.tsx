// import Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// import bootstrap
import 'bootstrap/dist/css/bootstrap.css';

// import glightbox
import 'glightbox/dist/css/glightbox.css';

// import aos css
import 'aos/dist/aos.css';

import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';

import Script from "next/script";

// AuthContext
import { AuthProvider } from './context/AuthContext';

// import customised components
import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './sections/Footer';
import BackToTopBtn from './components/BackToTopBtn';

// Providers
import Providers from "./providers";

// Cookie
import CookieConsent from "@/components/CookieConsent";

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Klub Kitchen 83',
  description: 'Bold street food flavours in Sketty, Swansea. Loaded fries, tacos, and famous burgers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <html lang="en">
      <body className={playfair.className}>
      <Providers>
        <TopBar />
        {/*<AuthProvider>*/}
        <Header />

          {children}

        <CookieConsent />
        {/*</AuthProvider>*/}
        <Footer />

        <BackToTopBtn />
      </Providers>

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
    </>
  );
}
