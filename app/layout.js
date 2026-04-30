import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-urdu',
});

export const metadata = {
  title: 'Mazdoor Market - Pakistan\'s AI Labor Marketplace',
  description: 'Find skilled workers near you. Plumbers, electricians, carpenters, and more.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoNastaliqUrdu.variable}`}>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '12px',
                  },
                }}
              />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}