import { Inter } from "next/font/google";
import Navbar from "@/components/ui/layout/NavBar";
import Footer from "@/components/ui/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import SearchModalWrapper from "@/components/search/SearchModalWrapper";
const inter = Inter({ subsets: ["latin"] });
import './globals.css'
export const metadata = {
  title: "MovieMate - Películas y Chat",
  description: "Aplicación para compartir y chatear sobre películas",
  icons: {
    icon: "/moviemate.ico",
    shortcut: "/moviemate.ico",
    apple: "/moviemate.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <QueryProvider>
          <AuthProvider>
            <SearchModalWrapper>
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-6">
                {children}
              </main>
              <Footer />
              <Toaster />
            </SearchModalWrapper>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
