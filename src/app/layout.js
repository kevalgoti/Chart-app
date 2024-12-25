import { ContactsProvider } from '../contexts/ContactsContext';
import { MessagesProvider } from '../contexts/MessagesContext';
import "./globals.css"

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContactsProvider>
          <MessagesProvider>
            {children}
          </MessagesProvider>
        </ContactsProvider>
      </body>
    </html>
  );
}
