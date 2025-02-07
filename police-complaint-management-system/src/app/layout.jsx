import "./globals.css";
import { Poppins } from "next/font/google";
import NavLink from "@/components/NavLink";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["200", "400", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Police Complaint Management System</title>
      </head>
      <body className={`${poppins.variable} font-sans`}>
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
