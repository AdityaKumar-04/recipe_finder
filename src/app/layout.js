import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/Clientprovider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RecipeFinder — Discover Recipes You'll Actually Cook",
  description:
    "Search thousands of recipes by ingredient, cuisine, or meal type. Get AI-powered recipe customizations tailored to your dietary needs.",
  keywords: "recipes, food, cooking, meal planning, AI recipe customizer, ingredients",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased bg-stone-50 text-slate-900`}>
        <ClientProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <AIAssistant />
        </ClientProvider>
      </body>
    </html>
  );
}
