import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({ subsets: ["latin"], weight: ["300","400","600","700","800"] });

export const metadata = {
  title: "bottopdf.com — Convert chats & images to PDFs",
  description: "Instantly convert WhatsApp chats, images, and merge PDFs into clean printable documents.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen relative bg-white antialiased`}>
        <AuthProvider>
              <Header />
          <main style={{position:'relative', zIndex:1}}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
