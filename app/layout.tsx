import '@/styles/globals.scss'
import { StrictMode } from 'react'
import HolyLoader from 'holy-loader'
import { type Metadata, type Viewport } from 'next'
import Providers from './providers'
import DeleteConfirmationDialog from '@/components/dialog/delete-confirmation-dialog'
import InfoConfirmationDialog from '@/components/dialog/info-confirmation-dialog'
import PreloadResources from '@/components/preload-resources'
import ScrollTopButton from '@/components/scroll-top-button'
import TailwindIndicator from '@/components/tailwind-indicator'
import { env } from '@/lib/config'
import { notoSansJP } from '@/lib/fonts'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1.0,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_HOST),
  title: 'のしメーカー',
  applicationName: 'のしメーカー',
  description: 'のしメーカーは、WordやExcelの図形操作に近い感覚で、オリジナルの熨斗紙や賞状を作成できるWebアプリケーションです。',
  openGraph: {
    title: 'のしメーカー',
    siteName: 'のしメーカー',
    description: 'のしメーカーは、WordやExcelの図形操作に近い感覚で、オリジナルの熨斗紙や賞状を作成できるWebアプリケーションです。',
    type: 'website',
    images: [''],
  },
  icons: [
    {
      rel: 'icon',
      url: '/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      url: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      url: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StrictMode>
      <PreloadResources />
      <html lang='jp' suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <HolyLoader color="#9333ea" height="1px" easing="linear" />
        <Providers>
          <div className='flex flex-col w-full min-h-screen overflow-x-hidden overflow-y-auto'>
            <main className='flex flex-col w-full min-h-screen'>
              {children}
            </main>
            <ScrollTopButton />
          </div>
          <TailwindIndicator />
          <InfoConfirmationDialog />
          <DeleteConfirmationDialog />
        </Providers>        
      </body>
    </html>
    </StrictMode>
  )
}