import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="/dashboard">
              Dashboard
            </Link>
            <Link className="nav-link" href="/dashboard/admin">
              Admin
            </Link>
            <Link className="nav-link" href="/register">
              Register
            </Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>footer</footer>
      </body>
    </html>
  );
}
