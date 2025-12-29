import { Poppins } from "next/font/google";
// dynamic import not needed here
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Client wrapper around the SectionAnimator client component
import ClientSectionAnimatorWrapper from '@/components/ClientSectionAnimatorWrapper'

const poppins = Poppins({ subsets: ["latin"], weight: ["300","400","600","700","800"] });

export const metadata = {
  title: "bottopdf.com — Convert chats & images to PDFs",
  description: "Instantly convert WhatsApp chats to PDFs, turn images into PDFs, or merge multiple PDFs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen relative bg-white antialiased`}>
        <AuthProvider>
          <Header />
          <main style={{position:'relative', zIndex:1}}>
            <ClientSectionAnimatorWrapper>
              {children}
            </ClientSectionAnimatorWrapper>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
